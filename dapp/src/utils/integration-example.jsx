// Examples of how different platforms can integrate DIM authentication

// 1. WordPress Plugin Integration
export const wordpressIntegration = `
<?php
// WordPress plugin example
function dim_auth_shortcode($atts) {
    $atts = shortcode_atts(array(
        'site_name' => get_bloginfo('name'),
        'redirect_url' => home_url('/dim-callback'),
        'required_credentials' => ''
    ), $atts);
    
    return '<div id="dim-auth-widget" 
                 data-site-name="' . esc_attr($atts['site_name']) . '"
                 data-redirect-url="' . esc_attr($atts['redirect_url']) . '"
                 data-required-credentials="' . esc_attr($atts['required_credentials']) . '">
            </div>
            <script src="https://your-dim-domain.com/widget.js"></script>';
}
add_shortcode('dim_auth', 'dim_auth_shortcode');
`

// 2. Express.js Middleware
export const expressMiddleware = `
// Express.js middleware for DIM authentication
const dimAuth = require('@dim/auth-middleware')

app.use('/protected', dimAuth({
  verifyEndpoint: 'https://your-dim-domain.com/api/verify',
  requiredCredentials: ['identity-verification'],
  onAuthFail: (req, res) => {
    res.redirect('/login?error=dim_auth_required')
  }
}))

app.get('/protected/dashboard', (req, res) => {
  // req.dimUser contains verified user data
  res.json({ user: req.dimUser })
})
`

// 3. Next.js API Route
export const nextjsApiRoute = `
// pages/api/auth/dim-verify.js
import { verifyAuthToken, getUserAuthProfile } from '@dim/auth-utils'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token } = req.body
    
    // Verify token
    const payload = verifyAuthToken(token)
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get user profile
    const profile = await getUserAuthProfile(payload.account)
    
    // Create session
    const session = await createSession(profile)
    
    res.json({ success: true, user: profile, sessionId: session.id })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}
`

// 4. Django Integration
export const djangoIntegration = `
# Django authentication backend
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
import requests

class DIMAuthBackend(BaseBackend):
    def authenticate(self, request, dim_token=None):
        if not dim_token:
            return None
            
        try:
            # Verify token with DIM API
            response = requests.post('https://your-dim-domain.com/api/verify', {
                'token': dim_token
            })
            
            if response.status_code == 200:
                data = response.json()
                account = data['profile']['account']
                
                # Get or create user
                user, created = User.objects.get_or_create(
                    username=account,
                    defaults={
                        'first_name': data['profile']['profile'].get('name', ''),
                        'is_active': True
                    }
                )
                return user
        except Exception as e:
            print(f"DIM auth error: {e}")
            
        return None
`

// 5. Mobile App Integration (React Native)
export const reactNativeIntegration = `
// React Native integration
import { DIMAuth } from '@dim/react-native-auth'

const LoginScreen = () => {
  const handleDIMAuth = async () => {
    try {
      const result = await DIMAuth.authenticate({
        siteName: 'My Mobile App',
        requiredCredentials: ['identity-verification']
      })
      
      // Store auth data
      await AsyncStorage.setItem('dim_token', result.token)
      await AsyncStorage.setItem('user_profile', JSON.stringify(result.profile))
      
      // Navigate to main app
      navigation.navigate('Dashboard')
    } catch (error) {
      Alert.alert('Authentication Failed', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDIMAuth} style={styles.authButton}>
        <Text>Login with DIM</Text>
      </TouchableOpacity>
    </View>
  )
}
`
