import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLeaseData } from '../context/LeaseDataContext';
import { EditIcon, DeleteIcon, SaveIcon, CancelIcon } from '../components/Icons';
import type { Field } from '../types';

const FieldsList = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById, updateField, deleteField } = useLeaseData();
  const document = getDocumentById(locationId || '');

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Field | null>(null);

  if (!document) {
    return <div className="no-data">Document not found</div>;
  }

  const handleEdit = (field: Field) => {
    setEditingField(field.field_id);
    setEditForm({ ...field, values: [...field.values] });
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm && locationId) {
      updateField(locationId, editForm.field_id, editForm);
      setEditingField(null);
      setEditForm(null);
    }
  };

  const handleDelete = (fieldId: string) => {
    if (locationId && window.confirm('Are you sure you want to delete this field?')) {
      deleteField(locationId, fieldId);
    }
  };

  const handleFieldNameChange = (value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, field_name: value });
    }
  };

  const handleValueChange = (index: number, value: string) => {
    if (editForm) {
      const newValues = [...editForm.values];
      newValues[index] = value;
      setEditForm({ ...editForm, values: newValues });
    }
  };

  return (
    <div className="fields-list">
      <div className="fields-header">
        <h2>Extracted Fields ({document.fields.length})</h2>
      </div>

      {document.fields.length === 0 ? (
        <p className="no-data">No fields extracted from this document.</p>
      ) : (
        <table className="fields-table">
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Value(s)</th>
              <th>Found in Clauses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {document.fields.map((field) => (
              <tr key={field.field_id}>
                {editingField === field.field_id && editForm ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editForm.field_name}
                        onChange={(e) => handleFieldNameChange(e.target.value)}
                        className="field-edit-input"
                      />
                    </td>
                    <td>
                      {editForm.values.map((value, index) => (
                        <input
                          key={index}
                          type="text"
                          value={value}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                          className="field-edit-input"
                        />
                      ))}
                    </td>
                    <td className="field-clauses">
                      {field.clause_indices.map((idx) => `#${idx + 1}`).join(', ')}
                    </td>
                    <td className="field-actions">
                      <button className="btn-save" onClick={handleSaveEdit}>
                        <SaveIcon /> Save
                      </button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        <CancelIcon /> Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="field-name">{field.field_name}</td>
                    <td className="field-values">
                      {field.values.map((value, index) => (
                        <span key={index} className="field-value-badge">
                          {value}
                        </span>
                      ))}
                    </td>
                    <td className="field-clauses">
                      {field.clause_indices.map((idx) => `#${idx + 1}`).join(', ')}
                    </td>
                    <td className="field-actions">
                      <button className="btn-edit" onClick={() => handleEdit(field)}>
                        <EditIcon /> Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(field.field_id)}>
                        <DeleteIcon /> Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FieldsList;
