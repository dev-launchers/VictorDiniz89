import Fuse from 'fuse.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Card from '../../common/Card';
import SearchBar from './Project/SearchBar';
import { Layout, ProjectContainer } from './StyledProjects';

const Projects = ({ projects }) => {
  const [searchValue, setSearchValue] = useState('');

  const options = {
    includeScore: true,
    keys: ['interests?.interest'],
    threshold: 0.3,
    ignoreFieldNorm: true,
  };

  const fuse = new Fuse(projects, options);
  const searchResult = fuse.search(searchValue).map(({ item }) => item);

  const searchProject = (searchQuery) => {
    setSearchValue(searchQuery);
  };

  const router = useRouter();

  if (router?.isFallback) {
    return <div>Loading...</div>;
  }

  const items = searchValue ? searchResult : projects;
console.log(items);
  return (
    <div
      style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '3rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Projects you can join!</h1>
        <SearchBar onChange={searchProject} />
      </div>

      <div>
      Create, discover, and join an agile team building open-source software projects! We help members to contribute meaningfully and gain industry-ready experience along the way. Build epic products, tools, and apps used by real people while learning valuable skills and meeting awesome people!
      </div>
      <Layout>
        {items.map((project, i) => {
          const imageUrl = process.env.NODE_ENV == "development" ? process.env.NEXT_PUBLIC_API_BASE_URL + project?.attributes?.heroImage?.data?.attributes?.url : project?.attributes?.heroImage?.data?.attributes?.url;
          return(
          <ProjectContainer key={i}>
            <Card
              isLinkingInside
              style={{ margin: 0, width: '100%', height: '100%' }}
              cardData={{
                id: project.attributes.id,
                title: project.attributes.title,
                secondaryText: `Commitment level: ${project.attributes.commitmentLevel}`,
                tags: project.attributes.interests?.map(({ interest }) => interest),
                description: project.attributes.catchPhrase,
                href: project.attributes.slug,
                imageSrc: imageUrl,
                actions: (
                  <>
                    <Link href={`${router?.asPath}/${project.attributes.slug}`} passHref>
                      <a>LEARN MORE</a>
                    </Link>
                    <Link href="support-us" passHref>
                      <a>DONATE</a>
                    </Link>
                  </>
                ),
              }}
            />
          </ProjectContainer>
          )
})}
      </Layout>
    </div>
  );
};
export default Projects;
