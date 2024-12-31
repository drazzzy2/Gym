import { QRCodeSVG } from 'qrcode.react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface MemberQRCodeProps {
  memberId: string;
  firstName: string;
  lastName: string;
}

export function MemberQRCode({ memberId, firstName, lastName }: MemberQRCodeProps) {
  const downloadQR = () => {
    const canvas = document.createElement("canvas");
    const svg = document.querySelector('.member-qr svg') as SVGElement;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${firstName}-${lastName}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="p-6 bg-zinc-800/50 border-zinc-700/50">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Member QR Code</h3>
          <Button
            onClick={downloadQR}
            variant="outline"
            size="sm"
            className="text-zinc-400 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg member-qr">
          <QRCodeSVG
            value={memberId}
            size={200}
            level="H"
            includeMargin
          />
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-900">{firstName} {lastName}</p>
            <p className="text-xs text-zinc-500">{memberId}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}