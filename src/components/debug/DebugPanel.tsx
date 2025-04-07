
import React, { useState, useEffect } from 'react';
import { isDebugEnabled, toggleDebug, debugLog } from '@/lib/debugUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BugPlay, X, RefreshCw } from 'lucide-react';
import { getTickets } from '@/services/ticketService';
import { Ticket } from '@/types';

const DebugPanel: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setDebugEnabled(isDebugEnabled());
    refreshData();
  }, []);

  const handleToggleDebug = () => {
    const newState = toggleDebug();
    setDebugEnabled(newState);
  };

  const refreshData = () => {
    const ticketData = getTickets();
    setTickets(ticketData);
    debugLog('Refreshed debug data', ticketData);
  };

  if (!showPanel) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        onClick={() => setShowPanel(true)}
      >
        <BugPlay className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Debug Panel</CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={refreshData}
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowPanel(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-xs">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span>Debug Mode:</span>
            <Button
              variant={debugEnabled ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={handleToggleDebug}
            >
              {debugEnabled ? "Enabled" : "Disabled"}
            </Button>
          </div>
          
          <div className="pt-2">
            <div className="font-semibold mb-1">Statistics:</div>
            <ul className="grid gap-1">
              <li className="flex justify-between">
                <span>Total Tickets:</span>
                <span>{tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)}</span>
              </li>
              <li className="flex justify-between">
                <span>Unique Events:</span>
                <span>{tickets.length}</span>
              </li>
              <li className="flex justify-between">
                <span>Past Events:</span>
                <span>
                  {tickets.filter(ticket => new Date(ticket.eventDate) < new Date()).length}
                </span>
              </li>
            </ul>
          </div>
          
          {debugEnabled && (
            <div className="pt-2">
              <div className="font-semibold mb-1">Last Events:</div>
              <div className="max-h-40 overflow-y-auto rounded border border-border p-1">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="border-b border-border/50 pb-1 mb-1 last:mb-0 last:border-0 last:pb-0">
                    <div className="font-medium">{ticket.eventName}</div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Qty: {ticket.quantity}</span>
                      <span>€{ticket.expectedRevenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
