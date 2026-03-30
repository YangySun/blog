<template>
  <div class="about-page">
    <h1 class="page-title">关于我</h1>
    
    <div class="profile-section">
      <div class="profile-card">
        <div class="avatar">
          <img src="/images/avatar/default.jpg" alt="Avatar" />
        </div>
        <h2 class="name">{{ profile.name }}</h2>
        <p class="bio">{{ profile.bio }}</p>
        <div class="contact">
          <a v-if="profile.email" :href="`mailto:${profile.email}`" class="contact-link">
            📧 {{ profile.email }}
          </a>
          <a v-if="profile.github" :href="profile.github" target="_blank" class="contact-link">
            🐙 GitHub
          </a>
        </div>
      </div>
    </div>

    <div class="skills-section">
      <h2 class="section-title">技能</h2>
      <div class="skills-list">
        <span v-for="skill in profile.skills" :key="skill" class="skill-tag">
          {{ skill }}
        </span>
      </div>
    </div>

    <div class="experience-section">
      <h2 class="section-title">经历</h2>
      <div class="timeline">
        <div v-for="(item, index) in profile.experience" :key="index" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-date">{{ item.date }}</p>
            <p class="timeline-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
})
</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.about-page {
  padding: $spacing-xl 0;
}

.page-title {
  font-size: $font-size-xxl;
  margin-bottom: $spacing-xl;
  text-align: center;
  color: var(--text-primary);
}

.profile-section {
  margin-bottom: $spacing-xl;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: $spacing-xl;
  background: var(--bg-primary);
  border-radius: $border-radius;
  box-shadow: var(--shadow);
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto $spacing-lg;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--accent-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.name {
  font-size: $font-size-xl;
  margin-bottom: $spacing-md;
  color: var(--text-primary);
}

.bio {
  color: var(--text-secondary);
  margin-bottom: $spacing-lg;
  line-height: 1.6;
}

.contact {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.contact-link {
  padding: $spacing-sm $spacing-md;
  background-color: var(--bg-secondary);
  border-radius: $border-radius;
  transition: $transition;

  &:hover {
    background-color: var(--bg-primary);
  }
}

.section-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-lg;
  color: var(--text-primary);
}

.skills-section {
  margin-bottom: $spacing-xl;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.skill-tag {
  padding: $spacing-sm $spacing-md;
  background-color: var(--accent-color);
  color: white;
  border-radius: $border-radius;
  font-size: $font-size-sm;
}

.experience-section {
  max-width: 800px;
  margin: 0 auto;
}

.timeline {
  position: relative;
  padding-left: $spacing-xl;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: $spacing-xl;
}

.timeline-dot {
  position: absolute;
  left: -30px;
  top: 6px;
  width: 14px;
  height: 14px;
  background-color: var(--accent-color);
  border-radius: 50%;
  border: 3px solid var(--bg-primary);
}

.timeline-content {
  padding: $spacing-lg;
  background: var(--bg-primary);
  border-radius: $border-radius;
  box-shadow: var(--shadow);
}

.timeline-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-sm;
  color: var(--text-primary);
}

.timeline-date {
  color: var(--accent-color);
  font-size: $font-size-sm;
  margin-bottom: $spacing-sm;
}

.timeline-description {
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>