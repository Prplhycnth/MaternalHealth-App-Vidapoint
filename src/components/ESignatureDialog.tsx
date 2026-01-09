import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  PenTool, 
  RefreshCw, 
  Shield
} from 'lucide-react';

interface ESignatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  facilityName: string;
}

export function ESignatureDialog({ 
  isOpen, 
  onClose, 
  onComplete,
  facilityName
}: ESignatureDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasSignature(false);
      clearSignature();
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    ctx.lineTo(x, y);
    ctx.stroke();
    
    if (!hasSignature) {
      setHasSignature(true);
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleConfirm = () => {
    if (!hasSignature) {
      return;
    }
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Digital Signature Required</DialogTitle>
          <DialogDescription>
            Sign to approve sharing your health records
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-center">
            <PenTool className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium">Consent Authorization</h3>
            <p className="text-sm text-muted-foreground">
              Please sign below to authorize sharing your health records with {facilityName}
            </p>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
            <canvas
              ref={canvasRef}
              width={280}
              height={120}
              className="w-full h-30 bg-white rounded border cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Sign above</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearSignature}
                className="h-6 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your digital signature serves as legal consent and will be encrypted and stored securely.
              This authorizes {facilityName} to access your medical information for coordinated care.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!hasSignature}
            className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
          >
            Confirm & Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
