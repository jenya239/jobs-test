import styled from 'styled-components'
import { Button, Card, Container, Dropdown, List, Segment } from 'semantic-ui-react'
import { useMemo, useState } from 'react'
import axios from 'axios'
import * as React from 'react'
import { InferGetServerSidePropsType } from 'next'

const mobile = `@media (max-width: 768px)`

interface IJob {
  listingHash: string
  jobId: string
  source: string
  showNewJobBedge: boolean
  jobDLPUrl: string
  location: string
  jobTitle: string
  companyName: string
  companyInitial: string
  estimatedSalary: string
  socode: string
  postedDate: string
  sponsorFlag?: any
  contactEmailsFlag: boolean
  easyApplyFlag: boolean
  skillsets: string[]
  OBJcountry: string
  OBJcity: string
  OBJstate: string
  OBJcompanyDisplay: string
  OBJindustry: string
  OBJpostingDate: string
  OBJtitle: string
  OBJtitleDisplay: string
  OBJurl: string
  OBJzipcode: string
  OBJjobTags: string[]
  shortDesc: string
}

interface IOption {
  key: string
  text: string
  value: string
}

export const getServerSideProps = async (): Promise<{ props: { data: IJob[] } }> => {
  const res = await axios.post('https://www.zippia.com/api/jobs/', {
    companySkills: true,
    dismissedListingHashes: [],
    fetchJobDesc: true,
    jobTitle: 'Business Analyst',
    locations: [],
    numJobs: 20,
    previousListingHashes: [],
  })

  return {
    props: {
      data: res.data.jobs,
    },
  }
}

const Jobs = ({
  data: jobs,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {
  const [company, setCompany] = useState<string>('')
  const [jobTimestamp, setJobTimestamp] = useState<number | undefined>(undefined)
  const [showCards, setShowCards] = useState<boolean>(true)

  const companies = useMemo<string[]>(() => {
    const set = new Set<string>()
    for (const job of jobs) {
      set.add(job.companyName)
    }
    return Array.from(set.values())
  }, [jobs])

  const companiesOptions = useMemo<IOption[]>(
    () =>
      companies.map((mappedCompany) => ({
        key: mappedCompany,
        text: mappedCompany,
        value: mappedCompany,
      })),
    [companies]
  )

  const filteredJobs = useMemo(
    () =>
      jobs
        .filter((job) => (company !== '' ? job.companyName === company : true))
        .filter((job) =>
          jobTimestamp ? new Date(job.OBJpostingDate).getTime() > jobTimestamp : true
        ),
    [jobs, company, jobTimestamp]
  )

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledDropdown
          placeholder="Company"
          options={[{ key: '', text: '', value: '' }].concat(companiesOptions)}
          onChange={(event: any, data: { value: string }) => setCompany(data.value as string)}
          value={company}
        />
        <Button
          toggle
          active={jobTimestamp !== undefined}
          onClick={() =>
            setJobTimestamp(
              jobTimestamp ? undefined : new Date().getTime() - 1000 * 60 * 60 * 24 * 7
            )
          }
        >
          Show last 7 days
        </Button>
        <Button toggle active={showCards} onClick={() => setShowCards(!showCards)}>
          Show cards
        </Button>
        <Button
          onClick={() => {
            setCompany('')
            setJobTimestamp(undefined)
            setShowCards(true)
          }}
        >
          Reset
        </Button>
      </StyledHeader>
      {showCards ? (
        <StyledCards itemsPerRow={4} stackable>
          {filteredJobs.slice(0, 10).map((job) => {
            return (
              <StyledCard key={job.jobId}>
                <Card.Content>
                  <Card.Header>{job.jobTitle}</Card.Header>
                  <Card.Meta>
                    {job.companyName}
                    <br />
                    {job.postedDate}
                  </Card.Meta>
                  <Card.Description>{job.shortDesc}...</Card.Description>
                </Card.Content>
              </StyledCard>
            )
          })}
        </StyledCards>
      ) : (
        <List divided relaxed>
          {filteredJobs.slice(0, 10).map((job) => {
            return (
              <List.Item key={job.jobId}>
                <List.Content>
                  <List.Header>{job.jobTitle}</List.Header>
                  <List.Description>{job.shortDesc}...</List.Description>
                </List.Content>
              </List.Item>
            )
          })}
        </List>
      )}
    </StyledContainer>
  )
}

export default Jobs

const StyledContainer = styled(Container)`
  ${mobile} {
    margin-left: 0.5em !important;
    margin-right: 0.5em !important;
  }
`

const StyledHeader = styled(Segment)`
  ${mobile} {
    > * {
      margin-bottom: 0.5em !important;
    }
  }
`

const StyledDropdown = styled(Dropdown)`
  margin-right: 10px;
`

const StyledCards = styled(Card.Group)`
  ${mobile} {
    margin-left: 0 !important;
    margin-right: -2em !important;
    margin-top: -4px !important;
  }
`

const StyledCard = styled(Card)`
  border: 1px solid #d4d4d5 !important;
  box-shadow: 0 22px 23px -19px rgba(0, 0, 0, 0.2) !important;
  ${mobile} {
    margin-top: 10px;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
`
