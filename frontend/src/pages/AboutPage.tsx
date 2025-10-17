import { Link } from 'react-router-dom'
import { GraduationCap, Users, Award, Target, Heart, Zap, Globe, BookOpen } from 'lucide-react'
import { ROUTES } from '../lib/urls'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About SkillHub</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Empowering learners worldwide with quality education and transforming lives through accessible, 
              high-quality online learning experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To democratize education by providing accessible, affordable, and high-quality online courses 
                that empower individuals to achieve their personal and professional goals. We believe everyone 
                deserves access to world-class learning opportunities, regardless of their location or background.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the world's leading platform for lifelong learning, where millions of students 
                and professionals can discover their passions, develop new skills, and unlock their full 
                potential through innovative and engaging educational experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Student-Centered</h3>
              <p className="text-gray-600">
                Every decision we make is focused on creating the best possible learning experience for our students.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards in course content, instructor expertise, and platform functionality.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously evolve our platform with cutting-edge technology and pedagogical approaches.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We foster a supportive learning community where students and instructors grow together.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                Education should be available to everyone, everywhere, at any time that suits their schedule.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lifelong Learning</h3>
              <p className="text-gray-600">
                We believe learning never stops and support continuous growth at every stage of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">SkillHub by the Numbers</h2>
            <p className="text-xl text-blue-100">Our impact on learners worldwide</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">1,000+</div>
              <div className="text-blue-100">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Countries Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SkillHub */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SkillHub?</h2>
            <p className="text-xl text-gray-600">What makes us different</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Expert Instructors</h3>
                  <p className="text-gray-600 text-sm">
                    Learn from industry professionals with real-world experience and proven teaching skills.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Comprehensive Content</h3>
                  <p className="text-gray-600 text-sm">
                    Access detailed courses with video lessons, quizzes, assignments, and hands-on projects.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Verified Certificates</h3>
                  <p className="text-gray-600 text-sm">
                    Earn industry-recognized certificates to showcase your achievements and advance your career.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Learn at Your Pace</h3>
                  <p className="text-gray-600 text-sm">
                    Study anytime, anywhere with lifetime access to course materials on all devices.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 rounded-lg p-3 flex-shrink-0">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Active Community</h3>
                  <p className="text-gray-600 text-sm">
                    Join a vibrant community of learners and get support through discussions and Q&A.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Career-Focused</h3>
                  <p className="text-gray-600 text-sm">
                    Courses designed to help you gain practical skills for real-world job opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students already learning on SkillHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to={ROUTES.COURSES}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 text-lg font-medium rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
