import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Share2, 
  Bell,
  X,
  ChevronUp
} from 'lucide-react';

interface FloatingActionButtonProps {
  pendingCount: number;
  onNavigateToSharing: () => void;
}

export function FloatingActionButton({ pendingCount, onNavigateToSharing }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Expanded State */}
      {isExpanded && (
        <div className="mb-3 bg-white rounded-lg shadow-lg border p-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Sharing Requests</h4>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {pendingCount} healthcare facilities requesting access to your records
          </p>
          <Button 
            size="sm" 
            className="w-full h-8"
            onClick={() => {
              onNavigateToSharing();
              setIsExpanded(false);
            }}
          >
            <Share2 className="w-3 h-3 mr-1" />
            Review Requests
          </Button>
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        className={`h-14 w-14 rounded-full shadow-lg relative transition-all ${
          isExpanded ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-500 hover:bg-orange-600'
        }`}
        onClick={() => {
          if (isExpanded) {
            setIsExpanded(false);
          } else {
            setIsExpanded(true);
          }
        }}
      >
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-white" />
        ) : (
          <>
            <Share2 className="w-6 h-6 text-white" />
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              {pendingCount > 9 ? '9+' : pendingCount}
            </Badge>
          </>
        )}
      </Button>
    </div>
  );
}