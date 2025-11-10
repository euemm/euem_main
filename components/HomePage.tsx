'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Calendar, Code, Palette, Smartphone, Monitor, ExternalLink } from 'lucide-react'
import projectsData from '../data/projects.json'

type Skill = {
	name: string
	level: number
	category: 'frontend' | 'backend' | 'mobile' | 'design' | 'tools'
	icon: React.ReactNode
}

type FeaturedProject = {
	id: string
	title: string
	description: string
	image: string
	technologies: string[]
	githubUrl?: string
	liveUrl?: string | boolean
	affiliated?: boolean
}

const skills: Skill[] = [
	{ name: 'React/Next.js', level: 80, category: 'frontend', icon: <Code className="h-5 w-5" /> },
	{ name: 'TypeScript', level: 80, category: 'frontend', icon: <Code className="h-5 w-5" /> },
	{ name: 'Node.js', level: 85, category: 'backend', icon: <Code className="h-5 w-5" /> },
	{ name: 'Python', level: 85, category: 'backend', icon: <Code className="h-5 w-5" /> },
	{ name: 'React Native', level: 85, category: 'mobile', icon: <Smartphone className="h-5 w-5" /> },
	{ name: 'Swift', level: 80, category: 'frontend', icon: <Code className="h-5 w-5" /> },
    { name: 'Kotlin', level: 70, category: 'frontend', icon: <Code className="h-5 w-5" /> },
    { name: 'Java', level: 85, category: 'backend', icon: <Code className="h-5 w-5" /> },
	{ name: 'Docker', level: 70, category: 'tools', icon: <Monitor className="h-5 w-5" /> },
	{ name: 'AWS', level: 65, category: 'tools', icon: <Monitor className="h-5 w-5" /> }
]

// Get featured projects from JSON data
const featuredProjects: FeaturedProject[] = projectsData.projects.filter(project => project.featured)

type HomePageProps = {
	onProjectClick?: (project: FeaturedProject) => void
	onViewProjects?: () => void
	onVisitProject?: (project: FeaturedProject) => void
}

export function HomePage({ onProjectClick, onViewProjects, onVisitProject }: HomePageProps) {
	const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all')
	const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
	const [isMounted, setIsMounted] = useState(false)
	
	// Refs for each section
	const heroRef = useRef<HTMLElement>(null)
	const aboutRef = useRef<HTMLElement>(null)
	const skillsRef = useRef<HTMLElement>(null)
	const projectsRef = useRef<HTMLElement>(null)
	const ctaRef = useRef<HTMLElement>(null)

	const skillCategories = [
		{ id: 'all', label: 'All Skills' },
		{ id: 'frontend', label: 'Frontend' },
		{ id: 'backend', label: 'Backend' },
		{ id: 'mobile', label: 'Mobile' },
		{ id: 'design', label: 'Design' },
		{ id: 'tools', label: 'Tools' }
	]

	const filteredSkills = activeSkillCategory === 'all' 
		? skills 
		: skills.filter(skill => skill.category === activeSkillCategory)

	// Mark as mounted and trigger hero animation
	useEffect(() => {
		setIsMounted(true)
		setTimeout(() => {
			setVisibleSections((prev) => {
				const newSet = new Set(prev)
				newSet.add('hero')
				return newSet
			})
		}, 50)
	}, [])

	// Intersection Observer for scroll animations
	useEffect(() => {
		if (!isMounted) return

		const observerOptions = {
			threshold: 0,
			rootMargin: '0px'
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target.id) {
					console.log('Section visible:', entry.target.id)
					setVisibleSections((prev) => {
						const newSet = new Set(prev)
						newSet.add(entry.target.id)
						return newSet
					})
				}
			})
		}, observerOptions)

		// Observe all sections except hero
		const sections = [aboutRef, skillsRef, projectsRef, ctaRef]
		
		// Set up observer immediately
		sections.forEach((ref) => {
			if (ref.current) {
				console.log('Observing section:', ref.current.id)
				observer.observe(ref.current)
			}
		})

		return () => {
			sections.forEach((ref) => {
				if (ref.current) {
					observer.unobserve(ref.current)
				}
			})
		}
	}, [isMounted])

	return (
		<div className="min-h-screen bg-background pt-16 sm:pt-20 pb-16 sm:pb-20">
			{/* Hero Section */}
			<section ref={heroRef} id="hero" className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 transition-all duration-700 ${visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
						<div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
							<div className="space-y-3 sm:space-y-4">
								<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
									Hi, I&apos;m{' '}
									<span className="text-euem-blue-600 dark:text-euem-blue-400">
										@EUEM
									</span>
								</h1>
								<h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
									Jungju Lee
								</h2>
								<p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                                Leading full stack projects with expertise in AWS, Javascript, Java, Python, Swift, Kotlin and more.
								</p>
							</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<button
								onClick={onViewProjects}
								className="inline-flex items-center gap-2 px-6 py-3 bg-euem-blue-600 hover:bg-euem-blue-700 text-white rounded-lg font-medium transition-colors ios-button"
							>
								View My Work
								<ArrowRight className="h-4 w-4" />
							</button>
							<button
								onClick={() => {
									const link = document.createElement('a');
									link.href = '/Jungju_Lee_Resume.pdf';
									link.download = 'Jungju_Lee_Resume.pdf';
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
								}}
								className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors ios-button"
							>
								<Download className="h-4 w-4" />
								Download CV
							</button>
						</div>

						{/* Social Links */}
						<div className="flex flex-wrap gap-3 sm:gap-4">
							<a
								href="https://github.com/euemm"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 sm:p-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
							>
								<Github className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
							</a>
							<a
								href="https://linkedin.com/in/jungju-lee"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 sm:p-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
							>
								<Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
							</a>
							<a
								href="mailto:euem@euem.net"
								className="p-2 sm:p-3 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
							>
								<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
							</a>
						</div>
					</div>

						{/* Profile Image */}
						<div className="relative order-1 lg:order-2 flex justify-end">
							<div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
								<div className="absolute inset-0 bg-gradient-to-br from-euem-blue-400 to-euem-purple-600 rounded-full blur-3xl opacity-20"></div>
								<div className="relative w-full h-full bg-card border border-border rounded-full overflow-hidden p-4">
									<Image
										src="/EUEM_LIGHT.png"
										alt="EUEM Logo"
										fill
										sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
										className="object-contain"
										style={{ display: 'block', transform: 'scale(1.01)' }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section ref={aboutRef} id="about" className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-700 ${visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">About Me</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
						<div className="flex items-center gap-2 sm:gap-3 justify-center">
							<MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-euem-blue-600" />
							<span className="text-sm sm:text-base text-muted-foreground">Waltham, MA</span>
						</div>
						<div className="flex items-center gap-2 sm:gap-3 justify-center">
							<Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-euem-blue-600" />
							<span className="text-sm sm:text-base text-muted-foreground">Available for work</span>
						</div>
						<div className="flex items-center gap-2 sm:gap-3 justify-center sm:col-span-2 lg:col-span-1">
							<Code className="h-4 w-4 sm:h-5 sm:w-5 text-euem-blue-600" />
							<span className="text-sm sm:text-base text-muted-foreground">5+ years experience</span>
						</div>
					</div>
					<p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-4 sm:px-0">
						I&apos;m a passionate full-stack developer with over 2 years of industry experience prior to college. <br/>
                        I excel in academic background and problem solving skills, backed by 5+ TA experiences. <br/>
						When I&apos;m not coding, you can find me exploring new technologies, 
						contributing to open source projects, or sharing knowledge with the 
						developer community.
					</p>
				</div>
			</section>

			{/* Skills Section */}
			<section ref={skillsRef} id="skills" className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 transition-all duration-700 ${visibleSections.has('skills') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
				<div className="max-w-6xl mx-auto">
					<h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 sm:mb-12">Skills & Technologies</h2>
					
					{/* Skill Categories */}
					<div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
						{skillCategories.map((category) => (
							<button
								key={category.id}
								onClick={() => setActiveSkillCategory(category.id)}
								className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
									activeSkillCategory === category.id
										? 'bg-euem-blue-600 text-white'
										: 'bg-card text-muted-foreground hover:bg-muted'
								}`}
							>
								{category.label}
							</button>
						))}
					</div>

					{/* Skills Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{filteredSkills.map((skill) => (
						<div
							key={skill.name}
							className="bg-card border border-border rounded-lg p-4 sm:p-6"
						>
								<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
									{skill.icon}
									<h3 className="font-semibold text-foreground text-sm sm:text-base">{skill.name}</h3>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div
										className="bg-euem-blue-600 h-2 rounded-full transition-all duration-1000"
										style={{ width: `${skill.level}%` }}
									></div>
								</div>
								<p className="text-xs sm:text-sm text-muted-foreground mt-2">{skill.level}%</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Projects Section */}
			<section ref={projectsRef} id="projects" className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 transition-all duration-700 ${visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-8 sm:mb-12">
						<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Featured Projects</h2>
						<p className="text-muted-foreground text-base sm:text-lg">
							Some of my recent work that I&apos;m particularly proud of
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						{featuredProjects.map((project) => (
							<div
								key={project.id}
								className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
								onClick={() => onProjectClick?.(project)}
							>
							<div className="relative h-40 sm:h-48 bg-gradient-to-br from-euem-blue-100 to-euem-purple-100 dark:from-euem-blue-300 dark:to-euem-purple-300">
								<Image
									src={project.image}
									alt={project.title}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-contain group-hover:scale-105 transition-transform duration-300"
								/>
								<div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
									{project.liveUrl && typeof project.liveUrl === 'string' && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation()
												onVisitProject?.(project)
											}}
											className="p-1.5 sm:p-2 bg-white/90 dark:bg-black/90 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
										>
											<ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
										</button>
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
								<div className="p-4 sm:p-6">
									<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-euem-blue-600 dark:group-hover:text-euem-blue-400 transition-colors">
										{project.title}
									</h3>
									<p className="text-muted-foreground text-sm mb-3 sm:mb-4 line-clamp-3">
										{project.description}
									</p>
									<div className="flex flex-wrap gap-1">
										{project.technologies.map((tech) => (
											<span
												key={tech}
												className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="text-center mt-8 sm:mt-12">
						<button
							onClick={onViewProjects}
							className="inline-flex items-center gap-2 px-6 py-3 bg-euem-blue-600 hover:bg-euem-blue-700 text-white rounded-lg font-medium transition-colors ios-button"
						>
							View All Projects
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section ref={ctaRef} id="cta" className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 transition-all duration-700 ${visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
				<div className="max-w-4xl mx-auto text-center bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-12">
					<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
						Let&apos;s Work Together
					</h2>
					<p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
						I&apos;m always interested in new opportunities and exciting projects. <br/>
						Let&apos;s discuss how we can bring your ideas to life.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
						<a
							href="mailto:euem@euem.net"
							className="inline-flex items-center gap-2 px-6 py-3 bg-euem-blue-600 hover:bg-euem-blue-700 text-white rounded-lg font-medium transition-colors ios-button"
						>
							<Mail className="h-4 w-4" />
							Get In Touch
						</a>
						<button
							onClick={() => {
								const link = document.createElement('a');
								link.href = '/Jungju_Lee_Resume.pdf';
								link.download = 'Jungju_Lee_Resume.pdf';
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
							}}
							className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors ios-button"
						>
							<Download className="h-4 w-4" />
							Download CV
						</button>
					</div>
				</div>
			</section>
		</div>
	)
}