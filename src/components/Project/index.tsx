import React, { FC, useEffect, useState } from "react";
import { Project } from "abstract-sdk";
import useSWR from "swr";
import useInterval from "../../../lib/utils/useInterval";
import Previews from "./Previews";
import useFetch from "../../../lib/utils/useFetch";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import Log from "../../../lib/utils/Log";

interface ProjectProps {
    project: Project;
    projectSteps: [number, (x: number) => void];
    token: string;
}

const SingleProject: FC<ProjectProps> = ({ projectSteps, project, token }) => {
    const [pSteps, setProjectStep] = projectSteps;
    const { data: settings } = useSWR("store/settings");
    const [isMounted, setisMounted] = useState(false);
    const [currentCollection, setCurrentCollection] = useState(null);
    const { delays } = settings;

    const fetcher = useFetch(token);

    const { data: collections } = useSWR(
        ["api/listCollections", project.id],
        (url, projectId) => fetcher(url, { projectId }),
        {
            onError: e =>
                Log(
                    `Error Getting Collections:, ${e}, Project Details:, ${project.id}, ${project.name}`
                )
        }
    );

    useEffect(() => {
        if (collections) {
            if (!collections.length) {
                return setProjectStep(pSteps + 1);
            }
            setCurrentCollection(collections);
        }
    }, [collections]);

    const [collectionStep] = useInterval({
        data: collections,
        delay: delays.collections
    });

    useEffect(() => {
        setisMounted(true);
        return () => setisMounted(false);
    }, []);

    const fadeProps = useSpring({ opacity: isMounted ? 1 : 0 });

    return (
        <StyledProject>
            <ProjectData style={fadeProps}>
                <img src={project.createdByUser.avatarUrl} />
                <div>
                    <h1>{project.name}</h1>
                    {project.about && <h2>{project.about}</h2>}
                </div>
            </ProjectData>
            {collections && (
                <Previews
                    token={token}
                    project={project}
                    collection={collections ? collections[collectionStep] : currentCollection}
                />
            )}
        </StyledProject>
    );
};

const StyledProject = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
`;
const ProjectData = styled(animated.div)`
    z-index: 91;
    position: absolute;
    bottom: 36px;
    left: 36px;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 36px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: saturate(180%) blur(20px);
    /* background: linear-gradient(
        to bottom,
        hsla(0, 0%, 0%, 0) 0%,
        hsla(0, 0%, 0%, 0.013) 8.1%,
        hsla(0, 0%, 0%, 0.049) 15.5%,
        hsla(0, 0%, 0%, 0.104) 22.5%,
        hsla(0, 0%, 0%, 0.175) 29%,
        hsla(0, 0%, 0%, 0.259) 35.3%,
        hsla(0, 0%, 0%, 0.352) 41.2%,
        hsla(0, 0%, 0%, 0.45) 47.1%,
        hsla(0, 0%, 0%, 0.55) 52.9%,
        hsla(0, 0%, 0%, 0.648) 58.8%,
        hsla(0, 0%, 0%, 0.741) 64.7%,
        hsla(0, 0%, 0%, 0.825) 71%,
        hsla(0, 0%, 0%, 0.896) 77.5%,
        hsla(0, 0%, 0%, 0.951) 84.5%,
        hsla(0, 0%, 0%, 0.987) 91.9%,
        hsl(0, 0%, 0%) 100%
    ); */
    h1 {
        font-size: 28px;
        margin: 0;
    }
    h2 {
        font-size: 16px;
        font-weight: 400;
        margin: 0.5em 0 0 0;
    }
    img {
        min-width: 48px;
        min-height: 48px;
        width: 48px;
        height: 48px;
        border-radius: 48px;
        overflow: hidden;
        margin: 0 24px 0 0;
    }
    div {
        flex-direction: column;
    }
`;

export default SingleProject;
