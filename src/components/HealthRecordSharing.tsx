import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { BiometricConsentDialog } from './BiometricConsentDialog';
import { 
  ArrowLeft, 
  Share2, 
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface HealthRecordSharingProps {
  onBack: () => void;
}

interface SharingRequest {
  id: string;
  facilityName: string;
  facilityType: string;
  requestDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  recordsRequested: string[];
  consentMethod?: string;
  consentMessage?: string;
}

export function HealthRecordSharing({ onBack }: HealthRecordSharingProps) {
  const [sharingRequests, setSharingRequests] = useState<SharingRequest[]>([
    {
      id: '1',
      facilityName: 'Montes Medical Clinic',
      facilityType: 'Private Clinic',
      requestDate: '2025-01-15',
      reason: 'Scheduled prenatal consultation on January 20, 2025',
      status: 'pending',
      recordsRequested: ['Prenatal Records', 'Lab Results', 'Vaccination History']
    },
    {
      id: '2',
      facilityName: 'Puerto Princesa General Hospital',
      facilityType: 'Public Hospital',
      requestDate: '2025-01-10',
      reason: 'Emergency consultation',
      status: 'approved',
      recordsRequested: ['All Medical Records']
    },
    {
      id: '3',
      facilityName: 'Barangay Health Center - Bancao-Bancao',
      facilityType: 'Barangay Health Station',
      requestDate: '2025-01-05',
      reason: 'Regular community health monitoring',
      status: 'declined',
      recordsRequested: ['Basic Health Information']
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<'approve' | 'decline' | null>(null);

  const handleApprove = (requestId: string) => {
    setSelectedRequest(requestId);
    setCurrentAction('approve');
    setShowBiometricDialog(true);
  };

  const handleDecline = (requestId: string) => {
    setSharingRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'declined' as const } : req
      )
    );
  };

  const handleBiometricComplete = () => {
    if (selectedRequest && currentAction === 'approve') {
      const now = new Date().toISOString();
      setSharingRequests(prev =>
        prev.map(req =>
          req.id === selectedRequest
            ? { ...req, status: 'approved' as const, consentMethod: 'biometric', consentMessage: `Health record sharing consented via biometrics on ${new Date(now).toLocaleString()}` }
            : req
        )
      );
    }
    setShowBiometricDialog(false);
    setSelectedRequest(null);
    setCurrentAction(null);
  };

  const pendingRequests = sharingRequests.filter(req => req.status === 'pending');
  const approvedRequests = sharingRequests.filter(req => req.status === 'approved');
  const declinedRequests = sharingRequests.filter(req => req.status === 'declined');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-orange-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-medium">Health Record Sharing</h1>
              <p className="text-xs text-muted-foreground">
                {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">About Record Sharing</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Healthcare facilities request access to your records to provide better coordinated care.
                  You can approve or decline each request. Approvals are recorded via biometric confirmation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Pending Requests</h2>
              <Badge variant="secondary">{pendingRequests.length}</Badge>
            </div>

            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-orange-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{request.facilityName}</h3>
                        <p className="text-xs text-muted-foreground">{request.facilityType}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Requested on {new Date(request.requestDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>

                    <div className="text-sm">
                      <p className="font-medium mb-1">Reason:</p>
                      <p className="text-gray-600">{request.reason}</p>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium mb-1">Records Requested:</p>
                      <div className="flex flex-wrap gap-1">
                        {request.recordsRequested.map((record, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            {record}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                      onClick={() => handleApprove(request.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Consent
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDecline(request.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Approved Requests */}
        {approvedRequests.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Approved</h2>
              <Badge variant="secondary">{approvedRequests.length}</Badge>
            </div>

            {approvedRequests.map((request) => (
              <Card key={request.id} className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-900">{request.facilityName}</h3>
                        <p className="text-xs text-green-700">{request.facilityType}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="text-sm text-green-700 mt-2">
                      <p>Access granted on {new Date(request.requestDate).toLocaleDateString()}</p>
                      {request.consentMessage && (
                        <p className="text-xs text-green-800 mt-1">{request.consentMessage}</p>
                      )}
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Declined Requests */}
        {declinedRequests.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Declined</h2>
              <Badge variant="secondary">{declinedRequests.length}</Badge>
            </div>

            {declinedRequests.map((request) => (
              <Card key={request.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{request.facilityName}</h3>
                        <p className="text-xs text-gray-600">{request.facilityType}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sharingRequests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No Sharing Requests</h3>
              <p className="text-gray-600 text-sm">
                Healthcare facilities haven't requested access to your records yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Biometric Consent Dialog */}
      <BiometricConsentDialog
        isOpen={showBiometricDialog}
        onClose={() => {
          setShowBiometricDialog(false);
          setSelectedRequest(null);
          setCurrentAction(null);
        }}
        onComplete={handleBiometricComplete}
        facilityName={
          selectedRequest
            ? sharingRequests.find(r => r.id === selectedRequest)?.facilityName || ''
            : ''
        }
      />
    </div>
  );
}
