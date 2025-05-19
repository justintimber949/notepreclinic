// File: quartz/components/PasswordProtection.tsx
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { jsx } from "preact/jsx-runtime"
import { useEffect, useState } from "preact/hooks"
import { Hash } from "crypto"
import style from "./styles/passwordProtection.scss"

interface PasswordProtectionOptions {
  /* 
   * File path to your hashing function (default: 'static/hash.js')
   * This should be a file that exports a function that takes a string and returns a hash
   */
  hashFunction?: string
}

// Component to handle password-protected content
export default ((opts?: PasswordProtectionOptions) => {
  const PasswordProtection: React.FC<QuartzComponentProps> = ({ fileData, displayClass }) => {
    // Skip if no password protection is required
    if (!fileData.frontmatter?.password) {
      return null
    }

    // State for password validation
    const [password, setPassword] = useState("")
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isError, setIsError] = useState(false)
    const hashedPassword = fileData.frontmatter.password
    
    // Check if we have a stored authorization token
    useEffect(() => {
      const storedAuth = localStorage.getItem(`quartz-auth-${fileData.slug}`)
      if (storedAuth === hashedPassword) {
        setIsAuthorized(true)
      }
    }, [fileData.slug, hashedPassword])

    // Function to handle password submission
    const handleSubmit = async (e: Event) => {
      e.preventDefault()
      
      try {
        // Dynamically import the hash function
        const hashModule = await import(opts?.hashFunction || "/static/hash.js")
        const hash = await hashModule.default(password)
        
        if (hash === hashedPassword) {
          // Store authorization for this page
          localStorage.setItem(`quartz-auth-${fileData.slug}`, hash)
          setIsAuthorized(true)
          setIsError(false)
        } else {
          setIsError(true)
        }
      } catch (error) {
        console.error("Error validating password:", error)
        setIsError(true)
      }
    }

    // If authorized, return null to allow content to be displayed
    if (isAuthorized) {
      return null
    }

    // Otherwise, show password input form
    return (
      <div class={`password-protection ${displayClass ?? ""}`}>
        <div class="password-form">
          <h2>Protected Content</h2>
          <p>This content is password protected.</p>
          <form onSubmit={handleSubmit}>
            <div class="input-group">
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="Enter password"
                aria-label="Password"
              />
              <button type="submit">Submit</button>
            </div>
            {isError && <p class="error">Incorrect password. Please try again.</p>}
          </form>
        </div>
      </div>
    )
  }

  PasswordProtection.displayName = "PasswordProtection"
  return PasswordProtection
}) as QuartzComponentConstructor
