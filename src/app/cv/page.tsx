"use client";
import { TextScramble } from "@/components/text-scramble";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Fragment, useState } from "react";

// CV Data
const CV_DATA = {
  header: {
    name: "VO NGOC QUANG MINH",
    contacts: [
      { text: "vnqminh0502@gmail.com", href: "mailto:vnqminh0502@gmail.com" },
      { text: "linkedin.com/in/minhvoomega", href: "https://linkedin.com/in/minhvoomega" },
      { text: "github.com/MinhOmega", href: "https://github.com/MinhOmega" },
      { text: "Hue", href: "#" },
      { text: "083-555-9175", href: "tel:083-555-9175" },
    ],
  },
  experience: {
    company: {
      name: "Company SNAPTEC VIETNAM",
      role: "Front-end Engineer",
      period: "Sep. '19 — Present",
      projects: [
        {
          name: "SaaS Theme",
          description:
            "Developed a customizable website solution, enabling users to tailor design and functionality, including translations, icons, and more.",
          technologies: "Javascript, NextJS, Redux, AWS (S3, Map)",
          responsibilities: [
            "Mentored juniors, conducted code reviews, and consulted on system improvements.",
            "Designed dynamic components and integrated country-specific payment methods.",
            "Enhanced performance with code splitting, lazy loading, and caching.",
          ],
          achievement:
            "Achieved A scores on GTmetrix (occasionally a B score during high traffic periods), improving load speed and reducing data transfer",
        },
        {
          name: "MID Dashboard",
          description: "Admin dashboard for simplified website configurations, reducing dependency on Magento admin.",
          technologies: "JavaScript, NextJS, Redux, AWS (S3, Map, AppSync)",
          responsibilities: [
            "Designed core UI components and migrated Magento functions to a new interface.",
            "Improved UX and transitioned from REST APIs to GraphQL via AWS AppSync.",
          ],
        },
        {
          name: "PWA Magento",
          description: "Customized an e-commerce site using Magento's PWA studio.",
          technologies: "JavaScript, React, Redux",
          responsibilities: [
            "Maintained and enhanced features based on client requirements.",
            "Researched and implemented optimizations to improve developer and user experiences.",
          ],
        },
      ],
    },
    freelance: [
      {
        name: "Instasalon Freelance",
        period: "Aug. '21 — Nov. '23",
        description: "Developed a scheduling and management system for nail salons in the US.",
        technologies: "TypeScript, JavaScript, React Native, Redux, Firebase",
        responsibilities: [
          "Designed responsive UX/UI for tablet devices based on Figma prototypes.",
          "Added features: real-time chat, appointment scheduling, drag-and-drop, in-app purchases, and offline capabilities.",
          "Published apps on Google Play and AppStore, resolving rejections.",
        ],
      },
      {
        name: "Personal SaaS",
        period: "May '24 — Present",
        description: "E-commerce and sales management platform for SMBs.",
        technologies: "TypeScript, Next.js, MongoDB, Prisma ORM, Redux, TailwindCSS, Docker",
        responsibilities: [
          "Built a Next.js 14 platform with server-side rendering and static generation.",
          "Developed responsive UI with TailwindCSS, animations, and form validation.",
        ],
      },
    ],
  },
  skills: [
    { category: "Languages", items: "JavaScript, TypeScript, GraphQL" },
    { category: "Framework", items: "NextJS, React Native, Redux, Taiwind CSS, SCSS, styled-components" },
    { category: "Software", items: "Atlassian (Jira, Confluence), Figma, Android studio, VSCode, Git" },
  ],
  education: {
    school: "Hue University of Sciences",
    degree: "Bachelor degree - Software Engineering",
    period: "2016 - 2020",
  },
  reward: {
    title: "SNAPTEC - HERO OF THE YEARS",
    date: "Aug. '21",
  },
};

// Add Vietnamese translation of CV_DATA
const CV_DATA_VI = {
  header: {
    name: "VÕ NGỌC QUANG MINH",
    contacts: CV_DATA.header.contacts, // Keep the same
  },
  experience: {
    company: {
      name: "Công ty SNAPTEC VIỆT NAM",
      role: "Kỹ sư Front-end",
      period: "Tháng 9/2019 — Hiện tại",
      projects: [
        {
          name: "SaaS Theme",
          description:
            "Phát triển giải pháp website tùy chỉnh, cho phép người dùng điều chỉnh thiết kế và chức năng, bao gồm bản dịch, biểu tượng, và nhiều hơn nữa.",
          technologies: "Javascript, NextJS, Redux, AWS (S3, Map)",
          responsibilities: [
            "Hướng dẫn junior, review code và tư vấn cải thiện hệ thống.",
            "Thiết kế các component động và tích hợp phương thức thanh toán theo quốc gia.",
            "Tăng cường hiệu suất với code splitting, lazy loading và caching.",
          ],
          achievement:
            "Đạt điểm A trên GTmetrix (thỉnh thoảng điểm B trong thời điểm cao điểm), cải thiện tốc độ tải và giảm truyền dữ liệu",
        },
        {
          name: "MID Dashboard",
          description:
            "Bảng điều khiển quản trị để đơn giản hóa cấu hình website, giảm phụ thuộc vào quản trị Magento.",
          technologies: "JavaScript, NextJS, Redux, AWS (S3, Map, AppSync)",
          responsibilities: [
            "Thiết kế các thành phần UI cốt lõi và chuyển đổi các chức năng Magento sang giao diện mới.",
            "Cải thiện UX và chuyển đổi từ REST APIs sang GraphQL thông qua AWS AppSync.",
          ],
        },
        {
          name: "PWA Magento",
          description: "Tùy chỉnh trang thương mại điện tử sử dụng PWA studio của Magento.",
          technologies: "JavaScript, React, Redux",
          responsibilities: [
            "Duy trì và nâng cao tính năng dựa trên yêu cầu của khách hàng.",
            "Nghiên cứu và triển khai tối ưu hóa để cải thiện trải nghiệm cho nhà phát triển và người dùng.",
          ],
        },
      ],
    },
    freelance: [
      {
        name: "Instasalon Freelance",
        period: "Tháng 8/2021 — Tháng 11/2023",
        description: "Phát triển hệ thống đặt lịch và quản lý cho các tiệm nail tại Mỹ.",
        technologies: "TypeScript, JavaScript, React Native, Redux, Firebase",
        responsibilities: [
          "Thiết kế UX/UI responsive cho thiết bị tablet dựa trên prototype Figma.",
          "Thêm tính năng: chat thời gian thực, đặt lịch hẹn, kéo thả, mua hàng trong ứng dụng và khả năng hoạt động offline.",
          "Xuất bản ứng dụng trên Google Play và AppStore, giải quyết các vấn đề bị từ chối.",
        ],
      },
      {
        name: "Personal SaaS",
        period: "Tháng 5/2024 — Hiện tại",
        description: "Nền tảng thương mại điện tử và quản lý bán hàng cho doanh nghiệp vừa và nhỏ.",
        technologies: "TypeScript, Next.js, MongoDB, Prisma ORM, Redux, TailwindCSS, Docker",
        responsibilities: [
          "Xây dựng nền tảng Next.js 14 với server-side rendering và static generation.",
          "Phát triển UI responsive với TailwindCSS, animation và form validation.",
        ],
      },
    ],
  },
  skills: [
    { category: "Ngôn ngữ", items: "JavaScript, TypeScript, GraphQL" },
    { category: "Framework", items: "NextJS, React Native, Redux, Taiwind CSS, SCSS, styled-components" },
    { category: "Phần mềm", items: "Atlassian (Jira, Confluence), Figma, Android studio, VSCode, Git" },
  ],
  education: {
    school: "Đại học Khoa học Huế",
    degree: "Cử nhân - Kỹ thuật Phần mềm",
    period: "2016 - 2020",
  },
  reward: {
    title: "SNAPTEC - ANH HÙNG CỦA NĂM",
    date: "Tháng 8/2021",
  },
};

const ProjectSection = ({ project }: { project: (typeof CV_DATA.experience.company.projects)[0] }) => (
  <div className="mb-4">
    <h4 className="font-semibold">Project: {project.name}</h4>
    <ul className="list-disc ml-4 md:ml-6 space-y-1" role="list">
      <li>
        <span className="font-medium">Description:</span> {project.description}
      </li>
      <li>
        <span className="font-medium">Technologies:</span> {project.technologies}
      </li>
      <li>
        <span className="font-medium">Responsibilities:</span>
        <ul className="list-circle ml-4 md:ml-6" role="list">
          {project.responsibilities.map((resp, idx) => (
            <li key={idx}>{resp}</li>
          ))}
        </ul>
      </li>
      {project.achievement && (
        <li>
          <span className="font-medium">Achievement:</span> {project.achievement}
        </li>
      )}
    </ul>
  </div>
);

const FreelanceSection = ({ project }: { project: (typeof CV_DATA.experience.freelance)[0] }) => (
  <div>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
      <h4 className="font-semibold">Project: {project.name}</h4>
      <span className="text-sm text-muted-foreground">{project.period}</span>
    </div>
    <ul className="list-disc ml-4 md:ml-6 space-y-1" role="list">
      <li>
        <span className="font-medium">Description:</span> {project.description}
      </li>
      <li>
        <span className="font-medium">Technologies:</span> {project.technologies}
      </li>
      <li>
        <span className="font-medium">Responsibilities:</span>
        <ul className="list-circle ml-4 md:ml-6" role="list">
          {project.responsibilities.map((resp, idx) => (
            <li key={idx}>{resp}</li>
          ))}
        </ul>
      </li>
    </ul>
  </div>
);

// Add this before the CVPage component
const handleDownloadPDF = () => {
  const pdfUrl = "/files/MinhVo-CV-Software Engineering.pdf";
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "MinhVo - CV - Software Engineering.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function CVPage() {
  const [isVietnamese] = useState(false);
  const [triggerScramble, setTriggerScramble] = useState(false);

  // const handleLanguageSwitch = () => {
  //   setTriggerScramble(true);
  //   setIsVietnamese(!isVietnamese);
  // };

  const currentData = isVietnamese ? CV_DATA_VI : CV_DATA;

  return (
    <>
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" role="main">
        {/* Header */}
        <header className="text-center space-y-4">
          <TextScramble
            as="h1"
            className="text-2xl sm:text-3xl font-bold"
            trigger={triggerScramble}
            onScrambleComplete={() => setTriggerScramble(false)}
          >
            {currentData.header.name}
          </TextScramble>
          <nav
            className="text-sm text-muted-foreground flex flex-wrap justify-center gap-y-2"
            aria-label="Contact information"
          >
            {currentData.header.contacts.map((contact, idx) => (
              <Fragment key={idx}>
                {idx > 0 && (
                  <span className="mx-2" aria-hidden="true">
                    •
                  </span>
                )}
                <a
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary inline-block"
                  aria-label={`Contact via ${contact.text}`}
                >
                  {contact.text}
                </a>
                {idx === 2 && <div className="basis-full hidden sm:block" />}
              </Fragment>
            ))}
          </nav>
        </header>

        {/* Work Experience */}
        <section aria-labelledby="work-experience">
          <h2 id="work-experience" className="text-xl font-bold border-b pb-1 mb-6">
            Work Experience
          </h2>
          <div className="space-y-8">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                <h3 className="font-bold">{currentData.experience.company.name}</h3>
                <span className="text-sm text-muted-foreground">{currentData.experience.company.period}</span>
              </div>
              <div className="italic mb-4">{currentData.experience.company.role}</div>
              {currentData.experience.company.projects.map((project, idx) => (
                <ProjectSection key={idx} project={project} />
              ))}
            </div>

            {currentData.experience.freelance.map((project, idx) => (
              <FreelanceSection key={idx} project={project} />
            ))}
          </div>
        </section>

        {/* Skills */}
        <section aria-labelledby="skills">
          <h2 id="skills" className="text-xl font-bold border-b pb-1 mb-6">
            Skills
          </h2>
          <div className="space-y-3">
            {currentData.skills.map((skill, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-1">
                <span className="font-medium min-w-[100px]">{skill.category}:</span>
                <span>{skill.items}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section aria-labelledby="education">
          <h2 id="education" className="text-xl font-bold border-b pb-1 mb-6">
            Education
          </h2>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
            <div>
              <h3 className="font-bold">{currentData.education.school}</h3>
              <div className="italic">{currentData.education.degree}</div>
            </div>
            <span className="text-sm text-muted-foreground">{currentData.education.period}</span>
          </div>
        </section>

        {/* Reward */}
        <section aria-labelledby="reward">
          <h2 id="reward" className="text-xl font-bold border-b pb-1 mb-6">
            Reward
          </h2>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
            <h3 className="font-bold">{currentData.reward.title}</h3>
            <span className="text-sm text-muted-foreground">{currentData.reward.date}</span>
          </div>
        </section>
      </article>

      {/* Fixed buttons */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        <Button
          onClick={handleDownloadPDF}
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        {/* <Button
          onClick={handleLanguageSwitch}
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Languages className="mr-2 h-4 w-4" />
          {isVietnamese ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        </Button> */}
      </div>
    </>
  );
}
