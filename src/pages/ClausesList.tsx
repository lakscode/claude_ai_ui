import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLeaseData } from '../context/LeaseDataContext';
import type { Clause } from '../types';

const ClausesList = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById, updateClause, deleteClause } = useLeaseData();
  const document = getDocumentById(locationId || '');

  const [editingClause, setEditingClause] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Clause | null>(null);

  if (!document) {
    return <div className="no-data">Document not found</div>;
  }

  const handleEdit = (clause: Clause) => {
    setEditingClause(clause.clause_index);
    setEditForm({ ...clause });
  };

  const handleCancelEdit = () => {
    setEditingClause(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm && locationId) {
      updateClause(locationId, editForm.clause_index, editForm);
      setEditingClause(null);
      setEditForm(null);
    }
  };

  const handleDelete = (clauseIndex: number) => {
    if (locationId && window.confirm('Are you sure you want to delete this clause?')) {
      deleteClause(locationId, clauseIndex);
    }
  };

  const handleFormChange = (field: keyof Clause, value: string | number) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  return (
    <div className="clauses-list">
      <div className="clauses-header">
        <h2>Clauses ({document.clauses.length})</h2>
      </div>

      {document.clauses.length === 0 ? (
        <p className="no-data">No clauses extracted from this document.</p>
      ) : (
        <div className="clauses-container">
          {document.clauses.map((clause) => (
            <div key={clause.clause_index} className="clause-card">
              {editingClause === clause.clause_index && editForm ? (
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
                      value={editForm.text}
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
                      value={editForm.confidence}
                      onChange={(e) => handleFormChange('confidence', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="btn-primary" onClick={handleSaveEdit}>Save</button>
                    <button className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="clause-header">
                    <span className="clause-index">#{clause.clause_index + 1}</span>
                    <span className="clause-type">{clause.type}</span>
                    <span className="clause-confidence">
                      {(clause.confidence * 100).toFixed(1)}% confidence
                    </span>
                    <div className="clause-actions">
                      <button className="btn-edit" onClick={() => handleEdit(clause)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(clause.clause_index)}>Delete</button>
                    </div>
                  </div>
                  <p className="clause-text">{clause.text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClausesList;
