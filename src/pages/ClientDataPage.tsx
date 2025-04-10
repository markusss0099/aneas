
import React from 'react';
import { Helmet } from 'react-helmet';
import ClientDataFileList from '@/components/client-data/ClientDataFileList';

const ClientDataPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dati Clienti | Cashflow Manager</title>
      </Helmet>
      <ClientDataFileList />
    </>
  );
};

export default ClientDataPage;
