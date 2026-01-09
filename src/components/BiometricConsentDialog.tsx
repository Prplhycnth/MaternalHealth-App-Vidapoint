import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Fingerprint, Shield, CheckCircle } from 'lucide-react';

interface BiometricConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  facilityName: string;
}

export function BiometricConsentDialog({ isOpen, onClose, onComplete, facilityName }: BiometricConsentDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setScanning(false);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleAuthenticate = () => {
    // Simulate a biometric authentication flow
    setScanning(true);
    setSuccess(false);
    setTimeout(() => {
      setScanning(false);
      setSuccess(true);
      // small delay to let the user see success state
      setTimeout(() => {
        onComplete();
      }, 600);
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Biometric Consent</DialogTitle>
          <DialogDescription>
            Authenticate with biometrics to confirm sharing your health records
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-center">
            <Fingerprint className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-medium">Consent via Biometrics</h3>
            <p className="text-sm text-muted-foreground">
              Use your device's biometric authentication (fingerprint/face) to record consent for {facilityName} to access your records.
            </p>
          </div>

          <div className="rounded-lg p-2">
            <div className="flex justify-center">
              <Button onClick={handleAuthenticate} disabled={scanning || success} className="w-48">
                {scanning ? 'Scanning...' : success ? 'Authenticated' : 'Authenticate (Biometrics)'}
              </Button>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your biometric confirmation will be recorded as consent. No biometric templates are stored by this demo — only a consent record is kept indicating successful authentication.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleAuthenticate} disabled={scanning || success} className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
            {scanning ? 'Scanning...' : success ? 'Authenticated' : 'Authenticate & Consent'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
