// File: quartz/components/pages/ArticleLayout.tsx (perbarui untuk mendukung password protection)

import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { jsx } from "preact/jsx-runtime"
import { useEffect, useState } from "preact/hooks"

// Komponen yang menampilkan konten sebenarnya dari protected page setelah password diotentikasi
const ProtectedContent = ({ fileData, displayClass }) => {
  const [content, setContent] = useState("")
  const [authorized, setAuthorized] = useState(false)
  
  useEffect(() => {
    // Periksa jika halaman ini dilindungi dengan password
    if (fileData.frontmatter?.password) {
      // Periksa jika kita memiliki token otorisasi yang tersimpan
      const storedAuth = localStorage.getItem(`quartz-auth-${fileData.slug}`)
      
      if (storedAuth === fileData.frontmatter.password) {
        // Jika kita otorisasi, tampilkan konten yang dilindungi
        setContent(fileData.frontmatter.protectedContent || "")
        setAuthorized(true)
      }
    } else {
      // Jika halaman tidak dilindungi dengan password, tampilkan konten normal
      setContent(fileData.content)
      setAuthorized(true)
    }
  }, [fileData.slug, fileData.frontmatter?.password])

  if (!authorized) {
    return null
  }

  return <div class={`article-content ${displayClass ?? ""}`} dangerouslySetInnerHTML={{ __html: content }} />
}

// Modifikasi komponen ArticleLayout yang ada
export default ((opts?: {}) => {
  // Komponen ArticleLayout yang sudah ada di sini
  const ArticleLayout: React.FC<QuartzComponentProps> = (props) => {
    const { fileData, children, displayClass } = props
    
    return (
      <article class={`popover-hint ${displayClass ?? ""}`}>
        {children}
        
        {/* Tampilkan konten normal jika tidak ada password, atau konten yang dilindungi jika ada password */}
        {fileData.frontmatter?.password ? (
          <ProtectedContent fileData={fileData} displayClass={displayClass} />
        ) : (
          <div class={`article-content ${displayClass ?? ""}`} dangerouslySetInnerHTML={{ __html: fileData.content }} />
        )}
      </article>
    )
  }

  ArticleLayout.displayName = "ArticleLayout"
  return ArticleLayout
}) as QuartzComponentConstructor
