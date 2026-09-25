import { notFound } from "next/navigation";
import ProjectDetail from "@/components/project-detail/ProjectDetail";
import { projects, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name.en} | Dange Associates`,
    description: `${project.tagline.en} ${project.location.en}.`,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <ProjectDetail slug={slug} />;
}
