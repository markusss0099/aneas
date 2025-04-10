
import React, { useEffect } from 'react';
import ClientDataFileList from '@/components/client-data/ClientDataFileList';

const ClientDataPage: React.FC = () => {
  useEffect(() => {
    // Set the document title directly instead of using react-helmet
    document.title = 'Dati Clienti | Cashflow Manager';
  }, []);

  return (
    <>
      <ClientDataFileList />
    </>
  );
};

export default ClientDataPage;
