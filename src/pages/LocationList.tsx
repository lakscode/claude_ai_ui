import { Link } from 'react-router-dom';
import { useLeaseData, getFieldValue } from '../context/LeaseDataContext';
import Loader from '../components/Loader';
import type { LeaseDocument } from '../types';

// Helper to get location name - Property Address or fallback to pdf_file
const getLocationName = (doc: LeaseDocument) => {
  const propertyAddress = getFieldValue(doc, 'Property Address');
  return propertyAddress !== 'N/A' ? propertyAddress : doc.pdf_file;
};

const LocationList = () => {
  const { documents, loading } = useLeaseData();

  if (loading) {
    return (
      <div className="location-list-page">
        <div className="location-list-header">
          <h1>Locations</h1>
        </div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="location-list-page">
      <div className="location-list-header">
        <h1>Locations</h1>
      </div>

      {/* Desktop Table View */}
      <div className="locations-table-container">
        <table className="locations-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Tenant</th>
              <th>Landlord</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Clauses</th>
              <th>Fields</th>
              <th>PDF File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td className="location-name">{getLocationName(doc)}</td>
                <td>{getFieldValue(doc, 'Tenant Name')}</td>
                <td>{getFieldValue(doc, 'Landlord Name')}</td>
                <td>{getFieldValue(doc, 'Term Start Date')}</td>
                <td>{getFieldValue(doc, 'Term End Date')}</td>
                <td className="text-center">{doc.total_clauses}</td>
                <td className="text-center">{doc.total_fields}</td>
                <td className="pdf-file">{doc.pdf_file}</td>
                <td>
                  <Link to={`/location/${doc._id}`} className="view-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="locations-mobile">
        {documents.map((doc) => (
          <Link
            to={`/location/${doc._id}`}
            key={doc._id}
            className="location-mobile-card"
          >
            <div className="mobile-card-header">
              <h2>{getLocationName(doc)}</h2>
            </div>
            <div className="mobile-field">
              <span className="mobile-label">Tenant:</span>
              <span>{getFieldValue(doc, 'Tenant Name')}</span>
            </div>
            <div className="mobile-field">
              <span className="mobile-label">Landlord:</span>
              <span>{getFieldValue(doc, 'Landlord Name')}</span>
            </div>
            <div className="mobile-field">
              <span className="mobile-label">Term:</span>
              <span>{getFieldValue(doc, 'Term Start Date')} - {getFieldValue(doc, 'Term End Date')}</span>
            </div>
            <div className="mobile-stats">
              <span>{doc.total_clauses} Clauses</span>
              <span>{doc.total_fields} Fields</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocationList;
