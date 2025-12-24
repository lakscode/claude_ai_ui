import { useParams } from 'react-router-dom';
import { useLeaseData, getFieldValue } from '../context/LeaseDataContext';

const Dashboard = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById } = useLeaseData();
  const document = getDocumentById(locationId || '');

  if (!document) {
    return <div className="no-data">Document not found</div>;
  }

  // Count clauses by type - each clause type has a values array
  const clausesByType = document.clauses.reduce((acc, clause) => {
    acc[clause.type] = clause.values.length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total clause values (all individual clauses across all types)
  const totalClauseValues = document.clauses.reduce((sum, clause) => sum + clause.values.length, 0);

  // Calculate average confidence across all clause values
  const allConfidences = document.clauses.flatMap(clause =>
    clause.values.map(v => v.confidence)
  );
  const avgConfidence = allConfidences.length > 0
    ? allConfidences.reduce((sum, c) => sum + c, 0) / allConfidences.length
    : 0;

  // Count fields with values
  const fieldsWithValues = document.fields.filter(f => f.values.length > 0).length;

  // Number of clause types
  const totalClauseTypes = document.clauses.length;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Clauses</h3>
          <div className="big-number">{totalClauseValues}</div>
          <p>{totalClauseTypes} clause types identified</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Fields</h3>
          <div className="big-number">{document.total_fields}</div>
          <p>{fieldsWithValues} fields with extracted values</p>
        </div>

        <div className="dashboard-card">
          <h3>Avg Confidence</h3>
          <div className="big-number">{(avgConfidence * 100).toFixed(1)}%</div>
          <p>Clause classification confidence</p>
        </div>

        <div className="dashboard-card">
          <h3>API Calls</h3>
          <div className="big-number">{document.openai_api_calls}</div>
          <p>OpenAI API calls used</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Clause Types Distribution</h3>
        <div className="clause-types-grid">
          {Object.entries(clausesByType).map(([type, count]) => (
            <div key={type} className="clause-type-card">
              <span className="clause-type-name">{type}</span>
              <span className="clause-type-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Key Lease Information</h3>
        <div className="key-info-grid">
          <div className="key-info-item">
            <span className="key-label">Property</span>
            <span className="key-value">{getFieldValue(document, 'Property Address')}</span>
          </div>
          <div className="key-info-item">
            <span className="key-label">Tenant</span>
            <span className="key-value">{getFieldValue(document, 'Tenant Name')}</span>
          </div>
          <div className="key-info-item">
            <span className="key-label">Landlord</span>
            <span className="key-value">{getFieldValue(document, 'Landlord Name')}</span>
          </div>
          <div className="key-info-item">
            <span className="key-label">Lease Period</span>
            <span className="key-value">
              {getFieldValue(document, 'Term Start Date')} - {getFieldValue(document, 'Term End Date')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
