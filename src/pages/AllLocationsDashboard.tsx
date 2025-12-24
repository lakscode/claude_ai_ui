import { Link } from 'react-router-dom';
import { useLeaseData, getFieldValue } from '../context/LeaseDataContext';
import Loader from '../components/Loader';
import { LocationIcon, DocumentIcon, ViewIcon } from '../components/Icons';

const AllLocationsDashboard = () => {
  const { documents, loading } = useLeaseData();

  if (loading) {
    return <Loader />;
  }

  // Calculate overall statistics
  const totalLocations = documents.length;

  const totalClauses = documents.reduce((sum, doc) => {
    return sum + doc.clauses.reduce((clauseSum, clause) => clauseSum + clause.values.length, 0);
  }, 0);

  const totalFields = documents.reduce((sum, doc) => sum + doc.fields.length, 0);

  const totalClauseTypes = documents.reduce((sum, doc) => sum + doc.clauses.length, 0);

  // Calculate average confidence across all documents
  const allConfidences = documents.flatMap(doc =>
    doc.clauses.flatMap(clause => clause.values.map(v => v.confidence))
  );
  const avgConfidence = allConfidences.length > 0
    ? allConfidences.reduce((sum, c) => sum + c, 0) / allConfidences.length
    : 0;

  // Get unique clause types across all documents
  const clauseTypesMap = new Map<string, number>();
  documents.forEach(doc => {
    doc.clauses.forEach(clause => {
      const current = clauseTypesMap.get(clause.type) || 0;
      clauseTypesMap.set(clause.type, current + clause.values.length);
    });
  });

  // Sort clause types by count
  const sortedClauseTypes = Array.from(clauseTypesMap.entries())
    .sort((a, b) => b[1] - a[1]);

  // Get locations with most clauses
  const locationsByClauseCount = documents
    .map(doc => ({
      id: doc._id,
      name: getFieldValue(doc, 'Property Address') !== 'N/A'
        ? getFieldValue(doc, 'Property Address')
        : doc.pdf_file,
      tenant: getFieldValue(doc, 'Tenant Name'),
      clauseCount: doc.clauses.reduce((sum, c) => sum + c.values.length, 0),
      fieldCount: doc.fields.length
    }))
    .sort((a, b) => b.clauseCount - a.clauseCount);

  return (
    <div className="all-locations-dashboard">
      <div className="dashboard-page-header">
        <h1>Dashboard</h1>
        <p>Overview of all locations and lease documents</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Locations</h3>
          <div className="big-number">{totalLocations}</div>
          <p>Lease documents processed</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Clauses</h3>
          <div className="big-number">{totalClauses}</div>
          <p>{totalClauseTypes} clause types identified</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Fields</h3>
          <div className="big-number">{totalFields}</div>
          <p>Extracted across all documents</p>
        </div>

        <div className="dashboard-card">
          <h3>Avg Confidence</h3>
          <div className="big-number">{(avgConfidence * 100).toFixed(1)}%</div>
          <p>Classification confidence</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Clause Types Distribution</h3>
        <div className="clause-types-grid">
          {sortedClauseTypes.map(([type, count]) => (
            <div key={type} className="clause-type-card">
              <span className="clause-type-name">{type}</span>
              <span className="clause-type-count">{count}</span>
            </div>
          ))}
          {sortedClauseTypes.length === 0 && (
            <p className="no-data-small">No clause types found</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Locations Overview</h3>
        <div className="locations-overview-grid">
          {locationsByClauseCount.map((location) => (
            <div key={location.id} className="location-overview-card">
              <div className="location-overview-header">
                <span className="location-icon-wrapper">
                  <LocationIcon />
                </span>
                <div className="location-overview-info">
                  <h4>{location.name}</h4>
                  <span className="location-tenant">{location.tenant}</span>
                </div>
              </div>
              <div className="location-overview-stats">
                <div className="stat-item">
                  <DocumentIcon />
                  <span>{location.clauseCount} clauses</span>
                </div>
                <div className="stat-item">
                  <span>{location.fieldCount} fields</span>
                </div>
              </div>
              <Link to={`/location/${location.id}`} className="view-location-btn">
                <ViewIcon /> View Details
              </Link>
            </div>
          ))}
          {locationsByClauseCount.length === 0 && (
            <p className="no-data">No locations found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllLocationsDashboard;
