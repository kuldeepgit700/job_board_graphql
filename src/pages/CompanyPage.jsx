import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/customHooks';


function CompanyPage() {
  const { companyId } = useParams();
  const { loading, company, error } = useCompany(companyId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="notification is-danger">Error loading company data.</div>;
  }


  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="subtitle is-4">
        Jobs at {company.name}
      </h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
