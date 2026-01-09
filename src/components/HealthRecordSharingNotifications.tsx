import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Share2, 
  Building2, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  FileText,
  Shield,
  History,
  Bell,
  Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ESignatureDialog } from './ESignatureDialog';

interface SharingRequest {
  id: string;
  requestingFacility: string;
  receivingFacility: string;
  requestDate: Date;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  reason: string;
  dataTypes: string[];
  requestingDoctor: string;
  status: 'pending' | 'approved' | 'denied';
  expiresAt: Date;
  signatureData?: {
    signature: string;
    pin: string;
    timestamp: Date;
    ipAddress: string;
    deviceId: string;
  };
  processedAt?: Date;
}

interface HealthRecordSharingNotificationsProps {
  onBack: () => void;
  isFirstTimeUser?: boolean;
}

export function HealthRecordSharingNotifications({ onBack, isFirstTimeUser = false }: HealthRecordSharingNotificationsProps) {
  const [requests, setRequests] = useState<SharingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SharingRequest | null>(null);
  const [isESignatureDialogOpen, setIsESignatureDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'deny' | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [filter, setFilter] = useState<'all' | 'high' | 'emergency'>('all');

  // Mock data - In real app, this would come from an API
  useEffect(() => {
    if (isFirstTimeUser) {
      setRequests([]);
      return;
    }
    
    const mockRequests: SharingRequest[] = [
      {
        id: '2',
        requestingFacility: 'Adventist Hospital Palawan',
        receivingFacility: 'Puerto Princesa General Hospital',
        requestDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        urgency: 'medium',
        reason: 'Routine prenatal care coordination and specialist consultation',
        dataTypes: ['Prenatal Records', 'Vaccination History'],
        requestingDoctor: 'Dr. John Martinez',
        status: 'pending',
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000) // Expires in 18 hours
      },
      {
        id: '3',
        requestingFacility: 'Ospital ng Palawan',
        receivingFacility: 'Rural Health Unit - Irawan',
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        urgency: 'low',
        reason: 'Follow-up care after hospital discharge',
        dataTypes: ['Discharge Summary', 'Medication List'],
        requestingDoctor: 'Dr. Ana Rodriguez',
        status: 'approved',
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
        processedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        signatureData: {
          signature: 'data:image/png;base64,...', // Mock signature data
          pin: '****',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          ipAddress: '192.168.1.100',
          deviceId: 'MOBILE_DEVICE_12345'
        }
      }
    ];
    setRequests(mockRequests);
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyTextColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-700 bg-red-50 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const handleRequestAction = (request: SharingRequest, action: 'approve' | 'deny') => {
    setSelectedRequest(request);
    setActionType(action);
    setIsESignatureDialogOpen(true);
  };

  const handleESignatureComplete = () => {
    if (!selectedRequest || !actionType) return;

    const updatedRequests = requests.map(request => 
      request.id === selectedRequest.id 
        ? { 
            ...request, 
            status: actionType === 'approve' ? 'approved' as const : 'denied' as const,
            processedAt: new Date()
          }
        : request
    );
    
    setRequests(updatedRequests);
    
    setIsESignatureDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const formatExpiresIn = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Expires soon';
    if (diffInHours === 1) return 'Expires in 1 hour';
    if (diffInHours < 24) return `Expires in ${diffInHours} hours`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Expires in 1 day';
    return `Expires in ${diffInDays} days`;
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const filteredPendingRequests = filter === 'all' 
    ? pendingRequests 
    : pendingRequests.filter(r => r.urgency === filter);

  const allRequests = requests.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 safe-area-top safe-area-bottom">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-medium">Sharing Requests</h1>
                <p className="text-sm text-muted-foreground">Health record sharing management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            All sharing requests require e-signature and security authentication. 
            You have complete control over your health data sharing.
          </AlertDescription>
        </Alert>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'pending' | 'all')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Pending ({pendingRequests.length})</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>All Requests</span>
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="mt-4 space-y-4">
            {/* Filter for Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Priority</option>
                  <option value="emergency">Emergency Only</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            )}

            {filteredPendingRequests.length > 0 ? (
              <div className="space-y-3">{filteredPendingRequests.map((request) => (


                <Card key={request.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{request.requestingFacility}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{request.requestingDoctor}</span>
                          </div>
                        </div>
                        <Badge 
                          className={`text-xs ${getUrgencyTextColor(request.urgency)}`}
                          variant="outline"
                        >
                          {request.urgency.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Transfer Info */}
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Share2 className="w-3.5 h-3.5 text-gray-600" />
                          <span className="font-medium">Transfer Request</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>From:</strong> {request.receivingFacility}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>To:</strong> {request.requestingFacility}
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Reason:</strong> {request.reason}
                        </p>
                      </div>

                      {/* Data Types */}
                      <div>
                        <p className="text-xs font-medium mb-2">Requested Records:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.dataTypes.map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(request.requestDate)}</span>
                        </div>
                        <span className="text-orange-600">
                          {formatExpiresIn(request.expiresAt)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 h-8"
                          onClick={() => handleRequestAction(request, 'deny')}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Deny
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                          onClick={() => handleRequestAction(request, 'approve')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Pending Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter !== 'all' 
                      ? `No ${filter} priority requests at the moment.`
                      : 'No healthcare facilities are currently requesting access to your records.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Requests Tab */}
          <TabsContent value="all" className="mt-4 space-y-4">
            {allRequests.length > 0 ? (
              <div className="space-y-3">
                {allRequests.map((request) => (
                  <Card key={request.id} className={request.status === 'pending' ? 'border-l-4 border-l-orange-500' : 'opacity-75'}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{request.requestingFacility}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{request.requestingDoctor}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge 
                              className={`text-xs ${getUrgencyTextColor(request.urgency)}`}
                              variant="outline"
                            >
                              {request.urgency.toUpperCase()}
                            </Badge>
                            {request.status !== 'pending' && (
                              <Badge className={`text-xs ${
                                request.status === 'approved' 
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : 'bg-red-100 text-red-700 border-red-200'
                              }`}>
                                {request.status === 'approved' ? (
                                  <><CheckCircle className="w-3 h-3 mr-1" />Approved</>
                                ) : (
                                  <><XCircle className="w-3 h-3 mr-1" />Denied</>
                                )}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Transfer Info */}
                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <Share2 className="w-3.5 h-3.5 text-gray-600" />
                            <span className="font-medium">Transfer Request</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            <strong>From:</strong> {request.receivingFacility}
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            <strong>To:</strong> {request.requestingFacility}
                          </p>
                          <p className="text-xs text-gray-600">
                            <strong>Reason:</strong> {request.reason}
                          </p>
                        </div>

                        {/* Data Types */}
                        <div>
                          <p className="text-xs font-medium mb-2">Requested Records:</p>
                          <div className="flex flex-wrap gap-1">
                            {request.dataTypes.map((type, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Time Info */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(request.requestDate)}</span>
                          </div>
                          {request.status === 'pending' ? (
                            <span className="text-orange-600">
                              {formatExpiresIn(request.expiresAt)}
                            </span>
                          ) : (
                            <span>
                              Processed: {request.processedAt ? formatTimeAgo(request.processedAt) : 'Unknown'}
                            </span>
                          )}
                        </div>

                        {/* Authentication Status for Processed Requests */}
                        {request.status !== 'pending' && request.signatureData && (
                          <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                            <div className="flex items-center space-x-2 mb-1">
                              <Shield className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-medium text-blue-800">Authenticated Action</span>
                            </div>
                            <div className="text-xs text-blue-700">
                              E-signature and security verification completed
                            </div>
                          </div>
                        )}

                        {/* Action Buttons for Pending */}
                        {request.status === 'pending' && (
                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 h-8"
                              onClick={() => handleRequestAction(request, 'deny')}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Deny
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                              onClick={() => handleRequestAction(request, 'approve')}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Requests Found</h3>
                  <p className="text-sm text-muted-foreground">
                    When healthcare facilities request access to your records, they will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

      </div>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        isOpen={isESignatureDialogOpen}
        onClose={() => setIsESignatureDialogOpen(false)}
        onComplete={handleESignatureComplete}
        facilityName={selectedRequest?.requestingFacility || ''}
      />
    </div>
  );
}