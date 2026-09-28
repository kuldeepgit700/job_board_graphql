import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "../auth";


const httpClient = new HttpLink({
  uri: "http://localhost:9000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();

  return {
    headers: {
      ...headers,
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpClient),
  cache: new InMemoryCache(),
  // defaultOptions:{
  //   query:{
  //     fetchPolicy: "network-only" // Always fetch from network to get the latest data
  //   },
  //   watchQuery:{
  //     fetchPolicy: "network-only" // Always fetch from network to get the latest data
  //   }
  // }
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;

export const jobByIDQuery = gql`
query jobById($id: ID!) {
  job(id: $id) {
    ...JobDetail
  }
}
${jobDetailFragment}
`;

export const jobsQuery = gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
       id
      date
      title
      company {
        id
        name
      }
    }
    totalCount
    }
  }
`;

export const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;

export async function getJobs() {
  const query = gql`
    query jobs($limit: Int!, offset: Int) {
      jobs(limit: $limit, offset: $offset) {
        id
        title
        date
        description
        company {
          id
          name
          description
        }
      }
    }
  `;
  const { data } = await apolloClient.query({
    query,
    variables: { limit: 10, offset: 0 },
    fetchPolicy: "network-only", // Always fetch from network to get the latest data
  });

  return data.jobs;
}
