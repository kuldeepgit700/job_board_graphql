import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/customHooks';
import Pagination from '../components/PaginationBar';

const JOBS_PER_PAGE = 10;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);
  
  console.log('[HomePage]', { jobs, loading, error });
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }


  // useEffect(() => {
  //   getJobs().then((retrievedJobs) => {
  //     setJobs(retrievedJobs);
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  // }, []);

  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
