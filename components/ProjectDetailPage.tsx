'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

type Project = {
	id: string
	title: string
	description: string
	image: string
	technologies: string[]
	date: string
	githubUrl?: string
	liveUrl?: string | boolean
	category: string
}

type ProjectDetailPageProps = {
	project: Project
	onBack: () => void
}

export function ProjectDetailPage({ project, onBack }: ProjectDetailPageProps) {
	const [markdownContent, setMarkdownContent] = useState<string>('')
	const [isLoading, setIsLoading] = useState(true)
	const [isHeaderVisible, setIsHeaderVisible] = useState(false)
	const [isContentVisible, setIsContentVisible] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Load markdown content from GitHub README or local file
		const loadMarkdown = async () => {
			try {
				let content = ''
				
				// First try to load from GitHub README if githubUrl exists
				if (project.githubUrl) {
					try {
						// Extract owner/repo from GitHub URL
						const githubMatch = project.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
						if (githubMatch) {
							const [, owner, repo] = githubMatch
							
							// Try different branch names
							const branches = ['main', 'master', 'develop']
							for (const branch of branches) {
								const githubReadmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`
								
								const response = await fetch(githubReadmeUrl)
								if (response.ok) {
									content = await response.text()
									// Remove GitHub-specific badges and links that might not work
									content = content.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, '')
									content = content.replace(/!\[.*?\]\(.*?\)/g, '')
									break // Found README, stop trying other branches
								}
							}
						}
					} catch (githubError) {
						console.log('GitHub README not found, trying local file...')
					}
				}
				
				// If no GitHub content, try local file
				if (!content) {
					const response = await fetch(`/projects/${project.id}.md`)
					if (response.ok) {
						content = await response.text()
					}
				}
				
				// If still no content, use fallback
				if (!content) {
					content = `# ${project.title}

${project.description}

## Technologies Used

${project.technologies.map(tech => `- ${tech}`).join('\n')}

## Project Details

This project was built using modern web technologies and best practices.

*Created: ${new Date(project.date).toLocaleDateString('en-US', { 
	year: 'numeric', 
	month: 'long', 
	day: 'numeric' 
})}*

## Links

${project.githubUrl ? `- [GitHub Repository](${project.githubUrl})` : ''}
${project.liveUrl && typeof project.liveUrl === 'string' ? `- [Live Demo](${project.liveUrl})` : ''}
`
				}
				
				setMarkdownContent(content)
			} catch (error) {
				console.error('Error loading markdown:', error)
				// Set fallback content
				setMarkdownContent(`# ${project.title}\n\n${project.description}`)
			} finally {
				setIsLoading(false)
			}
		}

		loadMarkdown()
	}, [project])

	// Show header immediately on mount
	useEffect(() => {
		setIsHeaderVisible(true)
	}, [])

	// Wait for markdown content to be fully rendered before showing
	useEffect(() => {
		if (!isLoading && markdownContent) {
			// Use a slight delay to ensure contentRef is attached and DOM is updated
			const timer = setTimeout(() => {
				if (contentRef.current) {
					setIsContentVisible(true)
				}
			}, 50)
			
			return () => clearTimeout(timer)
		}
	}, [isLoading, markdownContent])

	return (
		<div className="min-h-screen bg-background pt-8 sm:pt-12 pb-16 sm:pb-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

				{/* Project Header */}
				<div className={`max-w-4xl mx-auto mb-8 transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
					<div className="bg-card border border-border rounded-xl overflow-hidden">
						{/* Project Image */}
						<div className="relative h-64 sm:h-80 bg-gradient-to-br from-euem-blue-100 to-euem-purple-100 dark:from-euem-blue-300 dark:to-euem-purple-300">
							<Image
								src={project.image}
								alt={project.title}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 896px) 100vw, 896px"
								className="object-contain"
							/>
							<div className="absolute top-4 right-4 flex gap-2">
								{project.liveUrl && typeof project.liveUrl === 'string' && (
									<a
										href={project.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
									>
										<ExternalLink className="h-4 w-4 text-foreground" />
									</a>
								)}
								{project.githubUrl && (
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
									>
										<Github className="h-4 w-4 text-foreground" />
									</a>
								)}
							</div>
						</div>

						{/* Project Info */}
						<div className="p-6 sm:p-8">
							<div className="flex flex-wrap items-center gap-3 mb-4">
								<span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
									{project.category}
								</span>
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<Calendar className="h-4 w-4" />
									{new Date(project.date).toLocaleDateString('en-US', { 
										year: 'numeric', 
										month: 'long' 
									})}
								</div>
							</div>

							<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
								{project.title}
							</h1>

							<p className="text-lg text-muted-foreground mb-6">
								{project.description}
							</p>

							{/* Technologies */}
							<div className="flex flex-wrap gap-2">
								{project.technologies.map((tech) => (
									<span
										key={tech}
										className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Markdown Content */}
				<div className="max-w-4xl mx-auto">
					{!isLoading && (
						<div ref={contentRef} className={`bg-card border border-border rounded-xl p-6 sm:p-8 transition-all duration-700 ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
							<div className="prose prose-slate dark:prose-invert max-w-none">
								<ReactMarkdown
									components={{
										h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>,
										h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mb-3 mt-6">{children}</h2>,
										h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">{children}</h3>,
										p: ({ children }) => <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>,
										ul: ({ children }) => <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">{children}</ul>,
										ol: ({ children }) => <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-1">{children}</ol>,
										li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
										a: ({ href, children }) => (
											<a 
												href={href} 
												className="text-euem-blue-600 dark:text-euem-blue-400 hover:underline"
												target="_blank"
												rel="noopener noreferrer"
											>
												{children}
											</a>
										),
										code: ({ children }) => (
											<code className="bg-muted text-foreground px-1 py-0.5 rounded text-sm">
												{children}
											</code>
										),
										pre: ({ children }) => (
											<pre className="bg-muted text-foreground p-4 rounded-lg overflow-x-auto mb-4">
												{children}
											</pre>
										),
									}}
								>
									{markdownContent}
								</ReactMarkdown>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}