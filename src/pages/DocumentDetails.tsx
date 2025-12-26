import { useParams } from 'react-router-dom';
import { useLeaseData, getFieldValue } from '../context/LeaseDataContext';

const DocumentDetails = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById } = useLeaseData();
  const document = getDocumentById(locationId || '');

  if (!document) {
    return <div className="no-data">Document not found</div>;
  }

  return (
    <div className="document-details">
      <h2>Document Details</h2>

      <div className="details-grid">
        <div className="detail-section">
          <h3>File Information</h3>
          <div className="detail-row">
            <span className="label">PDF File</span>
            <span className="value">{document.pdf_file}</span>
          </div>
          <div className="detail-row">
            <span className="label">Storage Type</span>
            <span className="value">{document.storage_type}</span>
          </div>
          <div className="detail-row">
            <span className="label">Storage Location</span>
            <span className="value storage-path">{document.storage_location}</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Extraction Stats</h3>
          <div className="detail-row">
            <span className="label">Total Clauses</span>
            <span className="value">{document.total_clauses}</span>
          </div>
          <div className="detail-row">
            <span className="label">Total Fields</span>
            <span className="value">{document.total_fields}</span>
          </div>
          <div className="detail-row">
            <span className="label">OpenAI API Calls</span>
            <span className="value">{document.openai_api_calls}</span>
          </div>
          <div className="detail-row">
            <span className="label">Field Extraction</span>
            <span className="value">
              {document.field_extraction_enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Lease Information</h3>
          <div className="detail-row">
            <span className="label">Tenant</span>
            <span className="value">{getFieldValue(document, 'Tenant Name')}</span>
          </div>
          <div className="detail-row">
            <span className="label">Landlord</span>
            <span className="value">{getFieldValue(document, 'Landlord Name')}</span>
          </div>
          <div className="detail-row">
            <span className="label">Property Address</span>
            <span className="value">{getFieldValue(document, 'Property Address')}</span>
          </div>
          <div className="detail-row">
            <span className="label">Lease Start</span>
            <span className="value">{getFieldValue(document, 'Term Start Date')}</span>
          </div>
          <div className="detail-row">
            <span className="label">Lease End</span>
            <span className="value">{getFieldValue(document, 'Term End Date')}</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Document ID</h3>
          <div className="detail-row">
            <span className="label">ID</span>
            <span className="value mono">{document._id}</span>
          </div>
          <div className="detail-row">
            <span className="label">Storage Name</span>
            <span className="value mono">{document.storage_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
