export interface ClauseValue {
  clause_index: number;
  text: string;
  confidence: number;
}

export interface Clause {
  type: string;
  type_id: string;
  values: ClauseValue[];
}

export interface Field {
  field_id: string;
  field_name: string;
  values: string[];
  clause_indices: number[];
}

export interface LeaseDocument {
  _id: string;
  pdf_file: string;
  storage_type: string;
  storage_name: string;
  storage_location: string;
  total_clauses: number;
  total_fields: number;
  total_clause_types?: number;
  openai_api_calls: number;
  field_extraction_enabled: boolean;
  clauses: Clause[];
  fields: Field[];
  created_at?: string;
}

// Helper type to get field value by name
export type FieldName =
  | 'Tenant Name'
  | 'Landlord Name'
  | 'Landlord Address'
  | 'Premises Address'
  | 'Lease Start Date'
  | 'Lease End Date'
  | 'Monthly Rent';
