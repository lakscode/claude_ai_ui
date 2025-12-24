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
    total_clause_types: 6,
    openai_api_calls: 2,
    field_extraction_enabled: true,
    clauses: [
      {
        type: "Confidential Information",
        type_id: "5d51128d18b40d3e38ed435c",
        values: [{
          clause_index: 0,
          text: "EXHIBIT 10.01 COMMERCIAL LEASE AGREEMENT THIS COMMERCIAL LEASE AGREEMENT (this \"Lease\") is made and entered into as of the 1st day of September, 2018, by and between Luisa Fernández, a private individual with her address at 1500 Biscayne Blvd, Miami FL (\"Landlord\"), and VanguardLogic, located at 3250 NE 1st Ave, Miami FL (\"Tenant\").",
          confidence: 0.0948
        }]
      },
      {
        type: "Assignment and Subleasing",
        type_id: "63f37d2c0d2f74adc82f4103",
        values: [{
          clause_index: 1,
          text: "In consideration of the covenants and agreements herein contained, Landlord does hereby lease, let, and demise unto Tenant, and Tenant does hereby lease from Landlord, the property located at 3100 River Drive, Miami FL 33142 (the \"Premises\"), to be used exclusively for the operation of a software business under the name VanguardLogic.",
          confidence: 0.0806
        }]
      },
      {
        type: "Renewal",
        type_id: "63f37d2c0d2f74adc82f4107",
        values: [{
          clause_index: 2,
          text: "The lease term shall commence on September 1, 2018, and shall expire on August 31, 2024, with the option to renew as outlined in the \"Lease Renewal\" section of this Agreement.",
          confidence: 0.0664
        }]
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
    total_clause_types: 3,
    openai_api_calls: 2,
    field_extraction_enabled: true,
    clauses: [
      {
        type: "Confidential Information",
        type_id: "5d51128d18b40d3e38ed435c",
        values: [{
          clause_index: 0,
          text: "COMMERCIAL LEASE AGREEMENT between Harbor Properties LLC and TechHub Inc.",
          confidence: 0.0920
        }]
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
    total_clause_types: 4,
    openai_api_calls: 3,
    field_extraction_enabled: true,
    clauses: [
      {
        type: "Assignment and Subleasing",
        type_id: "63f37d2c0d2f74adc82f4103",
        values: [{
          clause_index: 0,
          text: "RETAIL LEASE AGREEMENT for premises located in Downtown Chicago.",
          confidence: 0.0850
        }]
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
  updateClause: (docId: string, clauseTypeIndex: number, updatedClause: Clause) => void;
  deleteClause: (docId: string, clauseTypeIndex: number) => void;
  updateField: (docId: string, fieldId: string, updatedField: Field) => void;
  deleteField: (docId: string, fieldId: string) => void;
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

  // Update a clause type (the entire clause object with its values array)
  const updateClause = (docId: string, clauseTypeIndex: number, updatedClause: Clause) => {
    setDocuments(prev => prev.map(doc => {
      if (doc._id === docId) {
        const newClauses = doc.clauses.map((clause, idx) =>
          idx === clauseTypeIndex ? updatedClause : clause
        );
        return { ...doc, clauses: newClauses };
      }
      return doc;
    }));
  };

  // Delete a clause type (removes the entire clause object)
  const deleteClause = (docId: string, clauseTypeIndex: number) => {
    setDocuments(prev => prev.map(doc => {
      if (doc._id === docId) {
        const newClauses = doc.clauses.filter((_, idx) => idx !== clauseTypeIndex);
        // Recalculate total_clauses by summing all values arrays
        const totalClauses = newClauses.reduce((sum, clause) => sum + clause.values.length, 0);
        return { ...doc, clauses: newClauses, total_clauses: totalClauses, total_clause_types: newClauses.length };
      }
      return doc;
    }));
  };

  const updateField = (docId: string, fieldId: string, updatedField: Field) => {
    setDocuments(prev => prev.map(doc => {
      if (doc._id === docId) {
        const newFields = doc.fields.map(field =>
          field.field_id === fieldId ? updatedField : field
        );
        return { ...doc, fields: newFields };
      }
      return doc;
    }));
  };

  const deleteField = (docId: string, fieldId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc._id === docId) {
        const newFields = doc.fields.filter(field => field.field_id !== fieldId);
        return { ...doc, fields: newFields, total_fields: newFields.length };
      }
      return doc;
    }));
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
