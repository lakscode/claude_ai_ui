import { useParams } from 'react-router-dom';
import { useLeaseData, getFieldValue } from '../context/LeaseDataContext';

const Dashboard = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById } = useLeaseData();
  const document = getDocumentById(locationId || '');

  if (!document) {
    return <div className="no-data">Document not found</div>;
  }

  // Group clauses by type
  const clausesByType = document.clauses.reduce((acc, clause) => {
    acc[clause.type] = (acc[clause.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average confidence
  const avgConfidence = document.clauses.length > 0
    ? document.clauses.reduce((sum, c) => sum + c.confidence, 0) / document.clauses.length
    : 0;

  // Count fields with values
  const fieldsWithValues = document.fields.filter(f => f.values.length > 0).length;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Clauses</h3>
          <div className="big-number">{document.total_clauses}</div>
          <p>{document.clauses.length} displayed in this view</p>
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
              {getFieldValue(document, 'Lease Start Date')} - {getFieldValue(document, 'Lease End Date')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
