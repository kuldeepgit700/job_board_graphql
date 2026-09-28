import  { useQuery, useMutation } from '@apollo/client/react';
import { companyByIdQuery, jobByIDQuery, createJobMutation, jobsQuery } from './queries';

export function useCompany(id){
    const { loading, data, error } = useQuery(companyByIdQuery, { variables: { id } });
    return { company: data?.company, loading, error: Boolean(error) };
  }

  export function useJob(id){
    const { loading, data, error } = useQuery(jobByIDQuery, { variables: { id } });
    return { job: data?.job, loading, error: Boolean(error) };
  }

  export function useJobs(limit, offset) {
    const { data, loading, error } = useQuery(jobsQuery, {
      variables: { limit, offset },
      fetchPolicy: 'network-only',
    });
    return { jobs: data?.jobs, loading, error: Boolean(error) };
  }
  
  export function useCreateJob() {
    const [executeJobMutation, { loading, error }] = useMutation(createJobMutation);
  
    const createJob = async ({ title, description }) => {
      const { data: { job }} = await executeJobMutation({ 
        variables: { input: { title, description } },
        update: (cache, { data }) => {
          if (!data?.job) return;

          cache.writeQuery({
            query: jobByIDQuery,
            variables: {
              id: data.job.id,
            },
            data: {
              job: data.job,
            },
          });
        },
      });
      return job;
    };
  
    return { createJob, loading, error: Boolean(error) };
  }