import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { LeaseDocument, Clause, Field } from '../types';
import { config } from '../config';

// Sample data to use when API fails
const sampleDocuments: LeaseDocument[] = [
  {
    pdf_file: "Vanguard-Logic 8.pdf",
    storage_type: "local",
    storage_name: "dcd31d4e-2ddf-481d-8d7e-07a6081a1ded_Vanguard-Logic 8.pdf",
    storage_location: "C:\\Users\\Koncordlaw\\lease_classifier_project\\mnt\\cp-files\\dcd31d4e-2ddf-481d-8d7e-07a6081a1ded_Vanguard-Logic 8.pdf",
    total_clauses: 18,
    total_fields: 19,
    openai_api_calls: 2,
    field_extraction_enabled: true,
    clauses: [
      {
        clause_index: 0,
        text: "EXHIBIT 10.01 COMMERCIAL LEASE AGREEMENT THIS COMMERCIAL LEASE AGREEMENT (this \"Lease\") is made and entered into as of the 1st day of September, 2018, by and between Luisa Fernández, a private individual with her address at 1500 Biscayne Blvd, Miami FL (\"Landlord\"), and VanguardLogic, located at 3250 NE 1st Ave, Miami FL (\"Tenant\").",
        type: "Confidential Information",
        type_id: "5d51128d18b40d3e38ed435c",
        confidence: 0.0948
      },
      {
        clause_index: 1,
        text: "In consideration of the covenants and agreements herein contained, Landlord does hereby lease, let, and demise unto Tenant, and Tenant does hereby lease from Landlord, the property located at 3100 River Drive, Miami FL 33142 (the \"Premises\"), to be used exclusively for the operation of a software business under the name VanguardLogic.",
        type: "Assignment and Subleasing",
        type_id: "63f37d2c0d2f74adc82f4103",
        confidence: 0.0806
      },
      {
        clause_index: 2,
        text: "The lease term shall commence on September 1, 2018, and shall expire on August 31, 2024, with the option to renew as outlined in the \"Lease Renewal\" section of this Agreement.",
        type: "Renewal",
        type_id: "63f37d2c0d2f74adc82f4107",
        confidence: 0.0664
      }
    ],
    fields: [
      { field_id: "64217b1a275caef553ece403", field_name: "Tenant Name", values: ["VanguardLogic"], clause_indices: [0] },
      { field_id: "64217b1a275caef553ece404", field_name: "Landlord Name", values: ["Luisa Fernández"], clause_indices: [0] },
      { field_id: "6423e1b7feb958238303006f", field_name: "Property Address", values: ["3100 River Drive, Miami FL 33142"], clause_indices: [1] },
      { field_id: "6423e1b7feb9582383030070", field_name: "Term Start Date", values: ["September 1, 2018"], clause_indices: [2] },
      { field_id: "6423e1b7feb9582383030071", field_name: "Term End Date", values: ["August 31, 2024"], clause_indices: [2] }
    ],
    _id: "694b7c11bb66bd71bb795eb0"
  },
  {
    pdf_file: "TechHub-Lease-2023.pdf",
    storage_type: "local",
    storage_name: "abc123_TechHub-Lease-2023.pdf",
    storage_location: "C:\\Users\\Koncordlaw\\lease_classifier_project\\mnt\\cp-files\\abc123_TechHub-Lease-2023.pdf",
    total_clauses: 15,
    total_fields: 12,
    openai_api_calls: 2,
    field_extraction_enabled: true,
    clauses: [
      {
        clause_index: 0,
        text: "COMMERCIAL LEASE AGREEMENT between Harbor Properties LLC and TechHub Inc.",
        type: "Confidential Information",
        type_id: "5d51128d18b40d3e38ed435c",
        confidence: 0.0920
      }
    ],
    fields: [
      { field_id: "64217b1a275caef553ece501", field_name: "Tenant Name", values: ["TechHub Inc."], clause_indices: [0] },
      { field_id: "64217b1a275caef553ece502", field_name: "Landlord Name", values: ["Harbor Properties LLC"], clause_indices: [0] },
      { field_id: "6423e1b7feb9582383030101", field_name: "Property Address", values: ["456 Ocean Drive, San Diego CA 92101"], clause_indices: [1] },
      { field_id: "6423e1b7feb9582383030102", field_name: "Term Start Date", values: ["January 1, 2023"], clause_indices: [2] },
      { field_id: "6423e1b7feb9582383030103", field_name: "Term End Date", values: ["December 31, 2025"], clause_indices: [2] }
    ],
    _id: "694b7c11bb66bd71bb795eb1"
  },
  {
    pdf_file: "RetailSpace-Downtown.pdf",
    storage_type: "local",
    storage_name: "def456_RetailSpace-Downtown.pdf",
    storage_location: "C:\\Users\\Koncordlaw\\lease_classifier_project\\mnt\\cp-files\\def456_RetailSpace-Downtown.pdf",
    total_clauses: 22,
    total_fields: 15,
    openai_api_calls: 3,
    field_extraction_enabled: true,
    clauses: [
      {
        clause_index: 0,
        text: "RETAIL LEASE AGREEMENT for premises located in Downtown Chicago.",
        type: "Assignment and Subleasing",
        type_id: "63f37d2c0d2f74adc82f4103",
        confidence: 0.0850
      }
    ],
    fields: [
      { field_id: "64217b1a275caef553ece601", field_name: "Tenant Name", values: ["Downtown Retail Co."], clause_indices: [0] },
      { field_id: "64217b1a275caef553ece602", field_name: "Landlord Name", values: ["Chicago Commercial Holdings"], clause_indices: [0] },
      { field_id: "6423e1b7feb9582383030201", field_name: "Property Address", values: ["789 Michigan Ave, Chicago IL 60611"], clause_indices: [1] },
      { field_id: "6423e1b7feb9582383030202", field_name: "Term Start Date", values: ["March 1, 2024"], clause_indices: [3] },
      { field_id: "6423e1b7feb9582383030203", field_name: "Term End Date", values: ["February 28, 2029"], clause_indices: [3] }
    ],
    _id: "694b7c11bb66bd71bb795eb2"
  }
];

interface LeaseDataContextType {
  documents: LeaseDocument[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getDocumentById: (id: string) => LeaseDocument | undefined;
  dismissError: () => void;
  updateClause: (docId: string, clauseIndex: number, updatedClause: Clause) => Promise<void>;
  deleteClause: (docId: string, clauseIndex: number) => Promise<void>;
  updateField: (docId: string, fieldId: string, updatedField: Field) => Promise<void>;
  deleteField: (docId: string, fieldId: string) => Promise<void>;
}

const LeaseDataContext = createContext<LeaseDataContextType | undefined>(undefined);

export const LeaseDataProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<LeaseDocument[]>(sampleDocuments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}${config.endpoints.data}`);
      console.log("response")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Handle different response formats
      let documentsArray: LeaseDocument[];
      if (Array.isArray(data)) {
        documentsArray = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        // Handle { data: [...] } format
        documentsArray = data.data;
      } else if (data && typeof data === 'object' && Array.isArray(data.documents)) {
        // Handle { documents: [...] } format
        documentsArray = data.documents;
      } else if (data && typeof data === 'object' && Array.isArray(data.results)) {
        // Handle { results: [...] } format
        documentsArray = data.results;
      } else {
        throw new Error('Invalid API response format - expected an array');
      }

      setDocuments(documentsArray);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(`API Error: ${errorMessage}. Showing sample data.`);
      setDocuments(sampleDocuments);
      console.error('Error fetching lease data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDocumentById = (id: string): LeaseDocument | undefined => {
    return documents.find(doc => doc._id === id);
  };

  const dismissError = () => {
    setError(null);
  };

  const updateClause = async (docId: string, clauseIndex: number, updatedClause: Clause) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/data/${docId}/clauses/${clauseIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClause),
      });

      if (!response.ok) {
        throw new Error(`Failed to update clause: ${response.status}`);
      }

      // Update local state on success
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newClauses = doc.clauses.map(clause =>
            clause.clause_index === clauseIndex ? updatedClause : clause
          );
          return { ...doc, clauses: newClauses };
        }
        return doc;
      }));
    } catch (err) {
      console.error('Error updating clause:', err);
      // Still update local state even if API fails (for offline/sample data mode)
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newClauses = doc.clauses.map(clause =>
            clause.clause_index === clauseIndex ? updatedClause : clause
          );
          return { ...doc, clauses: newClauses };
        }
        return doc;
      }));
    }
  };

  const deleteClause = async (docId: string, clauseIndex: number) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/data/${docId}/clauses/${clauseIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete clause: ${response.status}`);
      }

      // Update local state on success
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newClauses = doc.clauses.filter(clause => clause.clause_index !== clauseIndex);
          return { ...doc, clauses: newClauses, total_clauses: newClauses.length };
        }
        return doc;
      }));
    } catch (err) {
      console.error('Error deleting clause:', err);
      // Still update local state even if API fails (for offline/sample data mode)
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newClauses = doc.clauses.filter(clause => clause.clause_index !== clauseIndex);
          return { ...doc, clauses: newClauses, total_clauses: newClauses.length };
        }
        return doc;
      }));
    }
  };

  const updateField = async (docId: string, fieldId: string, updatedField: Field) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/data/${docId}/fields/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedField),
      });

      if (!response.ok) {
        throw new Error(`Failed to update field: ${response.status}`);
      }

      // Update local state on success
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newFields = doc.fields.map(field =>
            field.field_id === fieldId ? updatedField : field
          );
          return { ...doc, fields: newFields };
        }
        return doc;
      }));
    } catch (err) {
      console.error('Error updating field:', err);
      // Still update local state even if API fails (for offline/sample data mode)
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newFields = doc.fields.map(field =>
            field.field_id === fieldId ? updatedField : field
          );
          return { ...doc, fields: newFields };
        }
        return doc;
      }));
    }
  };

  const deleteField = async (docId: string, fieldId: string) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/data/${docId}/fields/${fieldId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete field: ${response.status}`);
      }

      // Update local state on success
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newFields = doc.fields.filter(field => field.field_id !== fieldId);
          return { ...doc, fields: newFields, total_fields: newFields.length };
        }
        return doc;
      }));
    } catch (err) {
      console.error('Error deleting field:', err);
      // Still update local state even if API fails (for offline/sample data mode)
      setDocuments(prev => prev.map(doc => {
        if (doc._id === docId) {
          const newFields = doc.fields.filter(field => field.field_id !== fieldId);
          return { ...doc, fields: newFields, total_fields: newFields.length };
        }
        return doc;
      }));
    }
  };

  return (
    <LeaseDataContext.Provider value={{
      documents,
      loading,
      error,
      refetch: fetchData,
      getDocumentById,
      dismissError,
      updateClause,
      deleteClause,
      updateField,
      deleteField
    }}>
      {error && (
        <div className="error-ribbon">
          <span>{error}</span>
          <button onClick={dismissError} className="error-ribbon-close">&times;</button>
        </div>
      )}
      {children}
    </LeaseDataContext.Provider>
  );
};

export const useLeaseData = (): LeaseDataContextType => {
  const context = useContext(LeaseDataContext);
  if (context === undefined) {
    throw new Error('useLeaseData must be used within a LeaseDataProvider');
  }
  return context;
};

// Helper function to get field value by name
export const getFieldValue = (doc: LeaseDocument, fieldName: string): string => {
  const field = doc.fields.find(f => f.field_name === fieldName);
  return field?.values[0] || 'N/A';
};
