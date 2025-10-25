'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import projectsData from '../data/projects.json'

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

// Use projects from JSON data
const mockProjects: Project[] = projectsData.projects

type ProjectsPageProps = {
	onProjectClick?: (project: Project) => void
}

export function ProjectsPage({ onProjectClick }: ProjectsPageProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')

	// Calculate categories dynamically from projects
	const categories = [
		{ id: 'all', label: 'All Projects', count: mockProjects.length },
		...Array.from(new Set(mockProjects.map(p => p.category)))
			.map(category => ({
				id: category.toLowerCase().replace(/\s+/g, '-'),
				label: category,
				count: mockProjects.filter(p => p.category === category).length
			}))
	]

	const filteredProjects = mockProjects.filter(project => {
		const matchesCategory = selectedCategory === 'all' || 
			project.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
		const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
		return matchesCategory && matchesSearch
	})

	return (
		<div className="min-h-screen bg-background pt-16 sm:pt-20 pb-16 sm:pb-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12">
					<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
						My Projects
					</h1>
					<p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
						A collection of projects I&apos;ve built using modern technologies and best practices.
					</p>
				</div>

				{/* Search and Filters */}
				<div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
					{/* Search Bar */}
					<div className="max-w-sm sm:max-w-md mx-auto">
						<div className="relative">
							<input
								type="text"
								placeholder="Search projects..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-euem-blue-500 focus:border-transparent text-sm sm:text-base"
							/>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Tag className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
							</div>
						</div>
					</div>

					{/* Category Filters */}
					<div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
									selectedCategory === category.id
										? 'bg-euem-blue-500 text-white'
										: 'bg-card text-muted-foreground hover:bg-euem-blue-100 dark:hover:bg-euem-blue-800'
								}`}
							>
								<span className="hidden sm:inline">{category.label}</span>
								<span className="sm:hidden">{category.label.split(' ')[0]}</span>
								<span className="ml-1">({category.count})</span>
							</button>
						))}
					</div>
				</div>

				{/* Projects Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{filteredProjects.map((project) => (
						<div
							key={project.id}
							className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
							onClick={() => onProjectClick?.(project)}
						>
							{/* Project Image */}
							<div className="relative h-40 sm:h-48 bg-gradient-to-br from-euem-blue-100 to-euem-purple-100 dark:from-euem-blue-300 dark:to-euem-purple-300">
								<Image
									src={project.image}
									alt={project.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-contain group-hover:scale-105 transition-transform duration-300"
								/>
								<div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-1.5 sm:gap-2">
									{project.liveUrl && project.liveUrl !== 'false' && typeof project.liveUrl === 'string' && (
										<a
											href={project.liveUrl}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="p-1.5 sm:p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
										>
											<ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
										</a>
									)}
									{project.githubUrl && (
										<a
											href={project.githubUrl}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="p-1.5 sm:p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
										>
											<Github className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
										</a>
									)}
								</div>
							</div>

							{/* Project Content */}
							<div className="p-4 sm:p-6">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
										{project.category}
									</span>
									<div className="flex items-center gap-1 text-xs text-muted-foreground">
										<Calendar className="h-3 w-3" />
										{new Date(project.date).toLocaleDateString('en-US', { 
											year: 'numeric', 
											month: 'short' 
										})}
									</div>
								</div>

								<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-euem-blue-600 dark:group-hover:text-euem-blue-400 transition-colors">
									{project.title}
								</h3>

								<p className="text-muted-foreground text-sm mb-3 sm:mb-4 line-clamp-3">
									{project.description}
								</p>

								{/* Technologies */}
								<div className="flex flex-wrap gap-1">
									{project.technologies.slice(0, 3).map((tech) => (
										<span
											key={tech}
											className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
										>
											{tech}
										</span>
									))}
									{project.technologies.length > 3 && (
										<span className="text-xs text-muted-foreground px-2 py-1">
											+{project.technologies.length - 3} more
										</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{filteredProjects.length === 0 && (
					<div className="text-center py-8 sm:py-12">
						<div className="text-muted-foreground mb-4">
							<Tag className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
							<h3 className="text-base sm:text-lg font-medium mb-2">No projects found</h3>
							<p className="text-sm px-4 sm:px-0">Try adjusting your search or filter criteria.</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}