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
    title: `${project.name.en} – ${project.location.en}`,
    description: `${project.name.en} by Dange Developers (Dange Associates). ${project.tagline.en} ${project.location.en}.`,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { images: [project.heroImage] },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <ProjectDetail slug={slug} />;
}
