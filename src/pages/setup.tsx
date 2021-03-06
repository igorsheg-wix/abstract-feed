/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useEffect, useState } from "react";
import { NextPage, NextPageContext } from "next";
import { Redirect } from "../../lib/utils/redirect";
import nextCookie from "next-cookies";
import useSWR, { mutate } from "swr";
import { feedSettings } from "../../lib/store";
import Router from "next/router";
import { Organization } from "abstract-sdk";
import useFetch from "../../lib/utils/useFetch";
import Button from "../components/Button";
import styled from "styled-components";
import Input from "../components/Input";
import Loader from "../components/Loader";
import { animated, useSpring } from "react-spring";
import LoadingDots from "../components/Loader/LoadingDots";
import { useToasts } from "../components/Toasts";

const Setup: NextPage<{ token: string }> = ({ token }) => {
    const { data: settings } = useSWR("store/settings", { initialData: feedSettings });
    const { section, organization } = settings;
    const [isLoading, setIsLoading] = useState(false);

    const toasts = useToasts();

    const fetcher = useFetch(token);

    const { data: orgs } = useSWR<Organization[]>(["api/listOrganizations"], fetcher);

    const { data: sections } = useSWR(
        organization.id ? ["api/listSections", organization.id] : null,
        (url, organizationId) => fetcher(url, { organizationId })
    );

    useEffect(() => {
        if (orgs?.length)
            mutate("store/settings", {
                ...settings,
                organization: { id: orgs[0].id, name: orgs[0].name }
            });
    }, [orgs]);

    useEffect(() => {
        const id = sections?.length ? sections[0].id : null;
        const name = sections?.length ? sections[0].name : "No sections";
        mutate("store/settings", { ...settings, section: { id, name } });
    }, [sections]);

    const changeHandler = ({ type, id, name }) => {
        mutate("store/settings", { ...settings, [type]: { id, name } });
    };

    const clickHandler = async () => {
        setIsLoading(true);
        const hasProjects = await fetcher("api/listProjects", {
            organizationId: organization.id,
            sectionId: section.id
        });

        if (hasProjects?.length) {
            Router.replace(`/index?sectionId=${section.id}&organizationId=${organization.id}`, "/");
        } else {
            toasts?.current.error(`No projects in this section. Select a different section.`);
        }

        setIsLoading(false);
    };

    const bodyAnim = useSpring({
        from: { opacity: 0 },
        to: { opacity: !orgs ? 0 : 1 }
    });

    if (!orgs && !sections) return <Loader centered />;

    const inputChangeHandler = ({ item, type }) => {
        changeHandler({ type: type, id: item.id, name: item.name });
    };

    return (
        <StyledPage style={bodyAnim}>
            <Title>
                <h1>Setup</h1>
                <h3>
                    Select which section from which organization you want to display projects from.
                </h3>
            </Title>

            <Body>
                <Input
                    options={orgs}
                    withArrow
                    value={organization.name}
                    onChange={item => inputChangeHandler({ item, type: "organization" })}
                />
                <Input
                    options={sections}
                    value={section.name}
                    withArrow
                    disabled={section.id ? false : true}
                    onChange={item => inputChangeHandler({ item, type: "section" })}
                />
                <Button disabled={isLoading} tabIndex={0} type="button" onClick={clickHandler}>
                    {isLoading ? (
                        <LoadingDots color="#9A9A9A" size={3}>
                            Loading
                        </LoadingDots>
                    ) : (
                        "Go To Feed"
                    )}
                </Button>
            </Body>
        </StyledPage>
    );
};

Setup.getInitialProps = async (ctx: NextPageContext) => {
    const { token } = nextCookie(ctx);
    if (!token) Redirect(ctx, "/token");
    return { token };
};

const StyledPage = styled(animated.div)`
    display: flex;
    width: 720px;
    height: 100vh;
    justify-content: center;
    flex-direction: column;
`;
const Title = styled.div`
    margin: 0 0 0 0;
    border: 2px solid ${props => props.theme.D50};
    border-bottom: none;
    h1 {
        font-size: 3.8em;
        margin: 0;
        padding: 36px;

        border-bottom: 2px solid ${props => props.theme.D50};
    }
    h3 {
        font-size: 20px;
        font-weight: 300;
        padding: 36px;

        line-height: 1.6em;
        margin: 0;
    }
`;

const Body = styled.div`
    display: flex;
    flex-direction: row;

    button {
        z-index: 91;
        width: 204px;
        margin: 0 0 0 -2px;
    }

    div {
        margin: 0;
        flex: 5;

        &:nth-child(2) {
            margin: 0 0px 0 -1px;
        }
    }
`;

export default Setup;
