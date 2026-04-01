<template>
  <div class="about-page">
    <div class="about-container">
      <header class="about-header">
        <h1 class="page-title">关于我</h1>
        <p class="page-subtitle">{{ profile.bio }}</p>
      </header>

      <section class="profile-section">
        <div class="profile-card">
          <div class="avatar-wrapper">
            <div class="avatar">
              <img v-if="profile.avatar" :src="profile.avatar" alt="Avatar" />
              <svg v-else class="avatar-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <h2 class="name">{{ profile.name }}</h2>
          <div class="contact-links">
            <a v-if="profile.email" :href="`mailto:${profile.email}`" class="contact-link" title="邮箱">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <a v-if="profile.github" :href="profile.github" target="_blank" class="contact-link" title="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section class="skills-section" v-if="profile.skills?.length">
        <h2 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          技能
        </h2>
        <div class="skills-grid">
          <span v-for="skill in profile.skills" :key="skill" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </section>

      <section class="experience-section" v-if="profile.experience?.length">
        <h2 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          经历
        </h2>
        <div class="timeline">
          <div v-for="(item, index) in profile.experience" :key="index" class="timeline-item">
            <div class="timeline-marker">
              <div class="timeline-dot"></div>
              <div class="timeline-line" v-if="index < profile.experience.length - 1"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h3 class="timeline-title">{{ item.title }}</h3>
                <span class="timeline-date">{{ item.date }}</span>
              </div>
              <p class="timeline-description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLoadingStore } from '../store/loading'

const loading = useLoadingStore()

const profile = ref({
  name: 'Your Name',
  bio: '前端开发工程师，热爱技术，喜欢分享',
  email: 'your.email@example.com',
  github: 'https://github.com/yourusername',
  skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Git'],
  experience: [
    {
      title: '前端开发工程师',
      date: '2020 - 至今',
      description: '负责公司前端项目的开发和维护'
    },
    {
      title: '计算机科学学士',
      date: '2016 - 2020',
      description: '毕业于XX大学计算机科学与技术专业'
    }
  ]
})

onMounted(async () => {
  try {
    const response = await import('../data/profile.json')
    profile.value = response.default
  } catch (error) {
    console.log('使用默认个人信息')
  }
  loading.finish('加载完成!')
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.about-page {
  @include page-container;
}

.about-container {
  max-width: 800px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: $spacing-sm;
}

.page-subtitle {
  font-size: $font-size-lg;
  color: var(--text-secondary);
}

.profile-section {
  margin-bottom: 48px;
}

.profile-card {
  text-align: center;
  padding: $spacing-xl;
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: $shadow;
}

.avatar-wrapper {
  margin-bottom: $spacing-lg;
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  color: var(--text-secondary);
}

.name {
  font-size: $font-size-xl;
  color: var(--text-primary);
  margin-bottom: $spacing-md;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
}

.contact-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  transition: $transition;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: var(--accent-color);
    color: white;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-xl;
  color: var(--text-primary);
  margin-bottom: $spacing-lg;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: var(--accent-color);
}

.skills-section {
  margin-bottom: 48px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.skill-tag {
  padding: $spacing-sm $spacing-md;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
  color: white;
  border-radius: 20px;
  font-size: $font-size-sm;
  font-weight: 500;
}

.experience-section {
  margin-bottom: 48px;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: var(--accent-color);
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline-line {
  width: 2px;
  flex: 1;
  background: var(--border-color);
  margin-top: $spacing-sm;
}

.timeline-content {
  flex: 1;
  padding: $spacing-lg;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: $shadow;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-sm;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.timeline-title {
  font-size: $font-size-lg;
  color: var(--text-primary);
}

.timeline-date {
  font-size: $font-size-sm;
  color: var(--accent-color);
  font-weight: 500;
}

.timeline-description {
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>