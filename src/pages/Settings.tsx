import { useParams } from 'react-router-dom';
import { useLeaseData } from '../context/LeaseDataContext';

const Settings = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById } = useLeaseData();
  const document = getDocumentById(locationId || '');

  if (!document) {
    return <div className="no-data">Document not found</div>;
  }

  return (
    <div className="settings">
      <h2>Settings</h2>

      <div className="settings-section">
        <h3>Document Information</h3>
        <div className="settings-form">
          <div className="form-group">
            <label>PDF File Name</label>
            <input type="text" defaultValue={document.pdf_file} readOnly />
          </div>
          <div className="form-group">
            <label>Storage Type</label>
            <input type="text" defaultValue={document.storage_type} readOnly />
          </div>
          <div className="form-group">
            <label>Storage Location</label>
            <input type="text" defaultValue={document.storage_location} readOnly />
          </div>
          <div className="form-group">
            <label>Document ID</label>
            <input type="text" defaultValue={document._id} readOnly />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Extraction Settings</h3>
        <div className="settings-form">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" defaultChecked={document.field_extraction_enabled} />
              Field Extraction Enabled
            </label>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Total Clauses</label>
              <input type="number" defaultValue={document.total_clauses} readOnly />
            </div>
            <div className="form-group">
              <label>Total Fields</label>
              <input type="number" defaultValue={document.total_fields} readOnly />
            </div>
            <div className="form-group">
              <label>API Calls Used</label>
              <input type="number" defaultValue={document.openai_api_calls} readOnly />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="settings-form">
          <div className="checkbox-group">
            <label>
              <input type="checkbox" defaultChecked />
              Email notifications for document updates
            </label>
          </div>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" defaultChecked />
              Notify when lease is expiring (30 days)
            </label>
          </div>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" />
              Weekly clause analysis reports
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Actions</h3>
        <div className="settings-actions">
          <button className="btn-primary">Re-process Document</button>
          <button className="btn-secondary">Export Data</button>
          <button className="btn-danger">Delete Document</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
