import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLeaseData } from '../context/LeaseDataContext';
import { EditIcon, DeleteIcon, SaveIcon, CancelIcon } from '../components/Icons';
import type { Clause, ClauseValue } from '../types';

const ClausesList = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById, updateClause, deleteClause } = useLeaseData();
  const document = getDocumentById(locationId || '');

  // Track editing by clause type index and value index within that type
  const [editingClause, setEditingClause] = useState<{ typeIndex: number; valueIndex: number } | null>(null);
  const [editForm, setEditForm] = useState<{ type: string; value: ClauseValue } | null>(null);

  if (!document) {
    return <div className="no-data">Document not found</div>;
  }

  // Count total individual clause values
  const totalClauseValues = document.clauses.reduce((sum, clause) => sum + clause.values.length, 0);

  const handleEdit = (typeIndex: number, valueIndex: number, clause: Clause, clauseValue: ClauseValue) => {
    setEditingClause({ typeIndex, valueIndex });
    setEditForm({
      type: clause.type,
      value: { ...clauseValue }
    });
  };

  const handleCancelEdit = () => {
    setEditingClause(null);
    setEditForm(null);
  };

  const handleSaveEdit = async (typeIndex: number) => {
    if (editForm && editingClause && locationId) {
      const originalClause = document.clauses[typeIndex];
      const updatedValues = originalClause.values.map((v, idx) =>
        idx === editingClause.valueIndex ? editForm.value : v
      );
      const updatedClause: Clause = {
        ...originalClause,
        type: editForm.type,
        values: updatedValues
      };
      const success = await updateClause(locationId, typeIndex, updatedClause);
      if (success) {
        setEditingClause(null);
        setEditForm(null);
      }
    }
  };

  const handleDeleteValue = async (typeIndex: number, valueIndex: number) => {
    if (!locationId) return;

    const clause = document.clauses[typeIndex];
    if (clause.values.length === 1) {
      // If this is the last value in the type, delete the entire clause type
      if (window.confirm('This is the last clause in this type. Delete the entire clause type?')) {
        await deleteClause(locationId, typeIndex);
      }
    } else {
      // Remove just this value from the clause type
      if (window.confirm('Are you sure you want to delete this clause?')) {
        const updatedValues = clause.values.filter((_, idx) => idx !== valueIndex);
        const updatedClause: Clause = {
          ...clause,
          values: updatedValues
        };
        await updateClause(locationId, typeIndex, updatedClause);
      }
    }
  };

  const handleFormChange = (field: keyof ClauseValue | 'type', value: string | number) => {
    if (editForm) {
      if (field === 'type') {
        setEditForm({ ...editForm, type: value as string });
      } else {
        setEditForm({
          ...editForm,
          value: { ...editForm.value, [field]: value }
        });
      }
    }
  };

  return (
    <div className="clauses-list">
      <div className="clauses-header">
        <h2>Clauses ({totalClauseValues})</h2>
        <span className="clause-types-count">{document.clauses.length} clause types</span>
      </div>

      {document.clauses.length === 0 ? (
        <p className="no-data">No clauses extracted from this document.</p>
      ) : (
        <div className="clauses-container">
          {document.clauses.map((clause, typeIndex) => (
            <div key={`${clause.type_id}-${typeIndex}`} className="clause-type-group">
              <div className="clause-type-header">
                <span className="clause-type-badge">{clause.type}</span>
                <span className="clause-count">{clause.values.length} clause{clause.values.length !== 1 ? 's' : ''}</span>
              </div>

              {clause.values.map((clauseValue, valueIndex) => (
                <div key={`${clauseValue.clause_index}-${valueIndex}`} className="clause-card">
                  {editingClause?.typeIndex === typeIndex && editingClause?.valueIndex === valueIndex && editForm ? (
                    <div className="clause-edit-form">
                      <div className="form-group">
                        <label>Type</label>
                        <input
                          type="text"
                          value={editForm.type}
                          onChange={(e) => handleFormChange('type', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Text</label>
                        <textarea
                          value={editForm.value.text}
                          onChange={(e) => handleFormChange('text', e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="form-group">
                        <label>Confidence</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={editForm.value.confidence}
                          onChange={(e) => handleFormChange('confidence', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="edit-actions">
                        <button className="btn-save" onClick={() => handleSaveEdit(typeIndex)}>
                          <SaveIcon /> Save
                        </button>
                        <button className="btn-cancel" onClick={handleCancelEdit}>
                          <CancelIcon /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="clause-header">
                        <span className="clause-index">#{clauseValue.clause_index + 1}</span>
                        <span className="clause-confidence">
                          {(clauseValue.confidence * 100).toFixed(1)}% confidence
                        </span>
                        <div className="clause-actions">
                          <button className="btn-edit" onClick={() => handleEdit(typeIndex, valueIndex, clause, clauseValue)}>
                            <EditIcon /> Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteValue(typeIndex, valueIndex)}>
                            <DeleteIcon /> Delete
                          </button>
                        </div>
                      </div>
                      <p className="clause-text">{clauseValue.text}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClausesList;
