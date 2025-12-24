import { useParams, NavLink, Outlet, Link } from 'react-router-dom';
import { useLeaseData, getFieldValue } from '../context/LeaseDataContext';
import Loader from '../components/Loader';

const LocationDetail = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { getDocumentById, loading } = useLeaseData();
  const document = getDocumentById(locationId || '');

  if (loading) {
    return <Loader />;
  }

  if (!document) {
    return (
      <div className="not-found">
        <h1>Location not found</h1>
        <Link to="/">Back to Locations</Link>
      </div>
    );
  }

  // Use Property Address or fallback to pdf_file
  const propertyAddress = getFieldValue(document, 'Property Address');
  const locationName = propertyAddress !== 'N/A' ? propertyAddress : document.pdf_file;

  return (
    <div className="location-detail">
      <div className="location-header">
        <Link to="/" className="back-link">
           Back to Locations
        </Link>
        <h1>{locationName}</h1>
        <p className="address">
          Tenant: {getFieldValue(document, 'Tenant Name')} | Landlord: {getFieldValue(document, 'Landlord Name')}
        </p>
      </div>

      <nav className="tabs">
        <NavLink
          to={`/location/${locationId}/clauses`}
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          Clauses
        </NavLink>
        <NavLink
          to={`/location/${locationId}/fields`}
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          Fields
        </NavLink>
        <NavLink
          to={`/location/${locationId}/details`}
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          Details
        </NavLink>
        <NavLink
          to={`/location/${locationId}/dashboard`}
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          Dashboard
        </NavLink>
        <NavLink
          to={`/location/${locationId}/settings`}
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          Settings
        </NavLink>
      </nav>

      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
};

export default LocationDetail;
