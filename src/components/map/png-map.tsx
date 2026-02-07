'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { REGIONS } from '@/lib/png-data';
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ProvinceData {
  provinceId: string;
  count: number;
}

interface PNGMapProps {
  data: ProvinceData[];
  onProvinceClick?: (provinceId: string) => void;
  selectedProvince?: string | null;
}

const PROVINCE_COORDS: Record<string, { lat: number; lng: number; name: string; region: string }> = {
  'western': { lat: -7.5, lng: 141.5, name: 'Western', region: 'southern' },
  'gulf': { lat: -7.5, lng: 145.0, name: 'Gulf', region: 'southern' },
  'central': { lat: -8.5, lng: 147.0, name: 'Central', region: 'southern' },
  'ncd': { lat: -9.45, lng: 147.15, name: 'NCD', region: 'southern' },
  'milne-bay': { lat: -10.0, lng: 150.5, name: 'Milne Bay', region: 'southern' },
  'northern': { lat: -8.5, lng: 148.0, name: 'Northern (Oro)', region: 'southern' },
  'southern-highlands': { lat: -6.0, lng: 143.5, name: 'Southern Highlands', region: 'highlands' },
  'hela': { lat: -5.5, lng: 142.8, name: 'Hela', region: 'highlands' },
  'enga': { lat: -5.3, lng: 143.5, name: 'Enga', region: 'highlands' },
  'western-highlands': { lat: -5.8, lng: 144.2, name: 'Western Highlands', region: 'highlands' },
  'jiwaka': { lat: -5.8, lng: 144.6, name: 'Jiwaka', region: 'highlands' },
  'chimbu': { lat: -6.0, lng: 145.0, name: 'Chimbu (Simbu)', region: 'highlands' },
  'eastern-highlands': { lat: -6.1, lng: 145.5, name: 'Eastern Highlands', region: 'highlands' },
  'morobe': { lat: -6.7, lng: 147.0, name: 'Morobe', region: 'momase' },
  'madang': { lat: -5.2, lng: 145.8, name: 'Madang', region: 'momase' },
  'east-sepik': { lat: -4.0, lng: 143.5, name: 'East Sepik', region: 'momase' },
  'sandaun': { lat: -3.5, lng: 141.5, name: 'Sandaun', region: 'momase' },
  'manus': { lat: -2.1, lng: 147.0, name: 'Manus', region: 'islands' },
  'new-ireland': { lat: -3.3, lng: 152.0, name: 'New Ireland', region: 'islands' },
  'east-new-britain': { lat: -4.5, lng: 152.0, name: 'East New Britain', region: 'islands' },
  'west-new-britain': { lat: -5.5, lng: 150.0, name: 'West New Britain', region: 'islands' },
  'bougainville': { lat: -6.2, lng: 155.5, name: 'Bougainville', region: 'islands' },
};

const REGION_COLORS: Record<string, string> = {
  highlands: '#059669',
  momase: '#0891b2',
  southern: '#d97706',
  islands: '#7c3aed',
};

export function PNGMap({ data, onProvinceClick, selectedProvince }: PNGMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [tooltipInfo, setTooltipInfo] = useState<{ x: number; y: number; province: string; count: number } | null>(null);

  const maxCount = Math.max(...data.map(d => d.count), 1);

  const toCanvasCoords = (lat: number, lng: number, width: number, height: number) => {
    const minLat = -12, maxLat = -1;
    const minLng = 140, maxLng = 160;
    const x = ((lng - minLng) / (maxLng - minLng)) * width * zoom;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height * zoom;
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.fillStyle = '#f0fdf4';
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 2;

    const mainlandPoints = [
      { lat: -2.5, lng: 141 }, { lat: -3, lng: 142 }, { lat: -4, lng: 143 },
      { lat: -5, lng: 142 }, { lat: -6, lng: 141 }, { lat: -8, lng: 141 },
      { lat: -9, lng: 143 }, { lat: -8.5, lng: 145 }, { lat: -9.5, lng: 147 },
      { lat: -10.5, lng: 150 }, { lat: -10, lng: 151 }, { lat: -8, lng: 148 },
      { lat: -6, lng: 148 }, { lat: -5, lng: 147 }, { lat: -4.5, lng: 145.5 },
      { lat: -3.5, lng: 144 }, { lat: -2.5, lng: 141 },
    ];

    const firstPoint = toCanvasCoords(mainlandPoints[0].lat, mainlandPoints[0].lng, width, height);
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (let i = 1; i < mainlandPoints.length; i++) {
      const point = toCanvasCoords(mainlandPoints[i].lat, mainlandPoints[i].lng, width, height);
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#f0fdf4';
    const nbPoints = [
      { lat: -5, lng: 148.5 }, { lat: -6, lng: 150 }, { lat: -5.5, lng: 152 },
      { lat: -4, lng: 152 }, { lat: -4.5, lng: 150 }, { lat: -5, lng: 148.5 },
    ];
    const nbFirst = toCanvasCoords(nbPoints[0].lat, nbPoints[0].lng, width, height);
    ctx.moveTo(nbFirst.x, nbFirst.y);
    for (let i = 1; i < nbPoints.length; i++) {
      const point = toCanvasCoords(nbPoints[i].lat, nbPoints[i].lng, width, height);
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    Object.entries(PROVINCE_COORDS).forEach(([id, coord]) => {
      const provinceData = data.find(d => d.provinceId === id);
      const count = provinceData?.count || 0;
      const { x, y } = toCanvasCoords(coord.lat, coord.lng, width, height);
      const minSize = 8;
      const maxSize = 30;
      const size = minSize + ((count / maxCount) * (maxSize - minSize));
      const regionColor = REGION_COLORS[coord.region] || '#64748b';

      if (selectedProvince === id) {
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(x, y, size + 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.fillStyle = hoveredProvince === id ? '#1e293b' : regionColor;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      if (count > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, size * 0.6)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count.toString(), x, y);
      }
    });
  }, [data, zoom, hoveredProvince, selectedProvince, maxCount]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    for (const [id, coord] of Object.entries(PROVINCE_COORDS)) {
      const pos = toCanvasCoords(coord.lat, coord.lng, width, height);
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < 25) {
        onProvinceClick?.(id);
        return;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    let found = false;
    for (const [id, coord] of Object.entries(PROVINCE_COORDS)) {
      const pos = toCanvasCoords(coord.lat, coord.lng, width, height);
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < 25) {
        setHoveredProvince(id);
        const provinceData = data.find(d => d.provinceId === id);
        setTooltipInfo({ x: e.clientX - rect.left, y: e.clientY - rect.top - 40, province: coord.name, count: provinceData?.count || 0 });
        found = true;
        break;
      }
    }
    if (!found) {
      setHoveredProvince(null);
      setTooltipInfo(null);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              MSME Distribution Map
            </CardTitle>
            <CardDescription>Click on a province to filter MSMEs</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} className="h-8 w-8"><ZoomOut className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(2, zoom + 0.2))} className="h-8 w-8"><ZoomIn className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(1)} className="h-8 w-8"><Maximize2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-sky-50 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full cursor-pointer"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => { setHoveredProvince(null); setTooltipInfo(null); }}
          />
          {tooltipInfo && (
            <div className="absolute bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10" style={{ left: tooltipInfo.x, top: tooltipInfo.y, transform: 'translateX(-50%)' }}>
              <p className="font-medium">{tooltipInfo.province}</p>
              <p className="text-sm text-slate-300">{tooltipInfo.count} MSMEs</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          {REGIONS.map(region => (
            <div key={region.id} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: REGION_COLORS[region.id] }} />
              <span className="text-sm text-slate-600">{region.name}</span>
            </div>
          ))}
        </div>
        {selectedProvince && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-emerald-900">{PROVINCE_COORDS[selectedProvince]?.name || selectedProvince}</p>
                <p className="text-sm text-emerald-700">{data.find(d => d.provinceId === selectedProvince)?.count || 0} registered MSMEs</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onProvinceClick?.('')} className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">Clear Selection</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
