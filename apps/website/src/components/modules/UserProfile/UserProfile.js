import React from 'react';
import { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css'; // import react-tabs styles
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';

import Button from '../../common/Button';
import PageBody from '../../common/PageBody';

import { useUserDataContext } from '@devlaunchers/components/context/UserDataContext';
import BioBox from './BioBox';
import Opportunities from './Opportunities';
import ProfileCard from './ProfileCard';
import RecommendedIdeas from './RecommendedIdeas';
import UserProjects from './UserProjects';
import People from './People';
import { Misc, UserInfo, UserSection, Wrapper } from './StyledUserProfile';
import UserInterests from './UserInterests';
import { useRouter } from 'next/router';
// import DiscordSection from "./DiscordSection/DiscordSection";
import { cleanDataList } from '@devlaunchers/components/utils/StrapiHelper';
import { agent } from '@devlaunchers/utility';

// State management component
export default function UserProfile({ otherUser }) {
  const { userData, isAuthenticated } = useUserDataContext();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = React.useState([]);
  const [myProjects, setMyProjects] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [ideas, setIdeas] = React.useState([]);
  const [people, setPeople] = React.useState([]);
  const [interests, setInterests] = React.useState([]);

  // If user hasn't set a username, redirect them to the signup form
  const router = useRouter();
  React.useEffect(() => {
    if (isAuthenticated && userData.name === '') router.push('/signup');
  }, [isAuthenticated]);

  React.useEffect(() => {
    getProjectData();
    getIdeaData();
    getPeopleData();
    getInterests();
  }, []);

  const getProjectData = async () => {
    try {
      const data = await agent.Projects.list({ populate: 'deep' });
      const cleanedData = cleanDataList(data);
      if (cleanedData) {
        setProjects(cleanedData);

        const tempOpportunities = [];
        cleanedData.forEach((project) => {
          project?.opportunities?.data?.forEach((opportunity) => {
            opportunity.attributes.project = project;
            tempOpportunities.push(opportunity);
          });
        });
        setOpportunities(tempOpportunities);
      }
    } catch (e) {
      console.error('Could not fetch project data', e);
    }
  };
  React.useEffect(() => {
    const myProjects = [];
    projects?.forEach((project) => {
      [...project?.team?.leaders, ...project?.team?.members].forEach(
        (member) => {
          console.log(member);
          if (member.id == userData.id) myProjects.push(project);
        }
      );
    });
    setMyProjects(myProjects);
  }, [projects, userData]);

  const getIdeaData = async () => {
    const data = cleanDataList(
      await agent.Ideas.get(new URLSearchParams(`populate=deep`))
    );

    setIdeas(data);
  };

  const getPeopleData = async () => {
    const userCount = (
      await axios(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/count`)
    ).data;
    let randomUserIds = [
      parseInt(Math.random() * userCount),
      parseInt(Math.random() * userCount),
      parseInt(Math.random() * userCount),
      parseInt(Math.random() * userCount),
      parseInt(Math.random() * userCount),
      parseInt(Math.random() * userCount),
    ];

    let usersData = await Promise.all(
      randomUserIds.map(
        async (userId) =>
          (
            await axios(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${userId}?populate=*`
            )
          ).data
      )
    );

    setPeople(usersData);
  };

  const getInterests = async () => {
    try {
      const { data } = await axios(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/interests?populate=deep`
      );
      setInterests(cleanDataList(data.data));
    } catch (e) {
      console.error('error fetching interests', e);
    }
  };

  useEffect(() => {
    setLoading(userData?.id === -1 || otherUser?.id === -1);
  }, [otherUser, userData]);

  return (
    <UserProfileView
      otherUser={otherUser}
      userData={userData}
      loading={loading}
      opportunities={opportunities}
      myProjects={userData.projects}
      projects={projects}
      ideas={ideas}
      people={people}
      interests={interests}
    />
  );
}

// View component
export function UserProfileView({
  otherUser,
  userData,
  loading,
  opportunities,
  myProjects,
  projects,
  ideas,
  people,
  interests,
}) {
  if (loading) {
    return <strong>Loading.....</strong>;
  }

  return (
    <PageBody>
      {userData?.id || (otherUser?.id && !loading) ? (
        <Wrapper>
          <UserSection>
            <ProfileCard
              img={
                otherUser?.profile?.profilePictureUrl ||
                userData.profilePictureUrl
              }
              name={otherUser?.profile?.displayName || userData.name}
              username={otherUser?.username || userData.username}
            />

            <UserInfo>
              {/* }
              <Points
                availablePoints={
                  otherUser?.point?.availablePoints || userData.availablePoints
                }
                seasonPoints={
                  otherUser?.point?.totalSeasonPoints ||
                  userData.totalSeasonPoints
                }
                volunteerHours={
                  otherUser?.point?.volunteerHours || userData.volunteerHours
                }
              />
              { */}
              <BioBox
                data={otherUser?.profile || userData}
                canEdit={!otherUser}
              />
            </UserInfo>
          </UserSection>

          {/*
          <LabCampus />
          */}

          <Misc>
            <Tabs
              defaultFocus={true}
              defaultIndex="0"
              style={{ width: '80vw', maxWidth: '1400px', minHeight: '30rem' }}
            >
              <TabList
                style={{
                  width: '100%',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {
                  // Have to do this hack for some reason (create empty tab if page not loaded)...
                  // otherwise tabs break
                  Object.entries(userData || {}).length === 0 ? <Tab></Tab> : ''
                }
                {
                  // Render tabs from our dynamically built learnPageData object
                  [
                    'Projects',
                    'People',
                    'Interests',
                    'Ideas',
                    'Opportunities',
                  ].map((key) => (
                    <Tab key={`tab${key}`}>{key}</Tab>
                  ))
                }
              </TabList>

              <TabPanel key={0}>
                <UserProjects myProjects={myProjects} />
              </TabPanel>

              <TabPanel key={1}>
                <People people={people} />
              </TabPanel>

              <TabPanel key={2}>
                <UserInterests interests={interests} />
              </TabPanel>

              <TabPanel key={3}>
                <RecommendedIdeas ideas={ideas} />
              </TabPanel>

              <TabPanel key={4}>
                <Opportunities opportunities={opportunities} />
              </TabPanel>
            </Tabs>

            {/* }<WeeksGlance />{ */}
            {/*
            <LabMember />
            */}
            {/*
              <DiscordSection
                discordId={userData.discord.id}
                avatarKey={userData.discord.avatar}
                discordUsername={userData.discord.username}
                discordDiscriminator={userData.discord.discriminator}
              /> */}
          </Misc>
        </Wrapper>
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '60vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '2rem' }}>
            Please sign in to access this page!
          </p>
          <Button
            fontSize="2rem"
            href={process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL}
          >
            Sign In
          </Button>
          <br />
        </div>
      )}
      <br />
    </PageBody>
  );
}
