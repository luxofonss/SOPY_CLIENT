/* eslint-disable react-hooks/exhaustive-deps */
import { AppRouteList } from '@src/containers/app/AppRoutes'
import { AuthRouteList } from '@src/containers/authentication/AuthRoutes'
import { memo, useEffect } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Cookies from 'universal-cookie'
import { authApi } from '@src/containers/authentication/feature/Auth/authService'
import { toast } from 'react-toastify'
import { login, setUser } from '@src/containers/authentication/feature/Auth/authSlice'
import { isEmptyValue } from '@src/helpers/check'
import { useDispatch } from 'react-redux'

const cookies = new Cookies()

export const AppRoutes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [loginSuccess] = authApi.endpoints.oAuthLogin.useLazyQuery()
  const [refreshToken] = authApi.endpoints.refreshToken.useLazyQuery()
  const [getProfile] = authApi.endpoints.getProfile.useLazyQuery()

  useEffect(() => {
    const accessToken = cookies.get('access_token')
    console.log('accessToken', accessToken)
    if (isEmptyValue(accessToken)) {
      const loginRequest = async () => {
        console.log('login request running')
        const response = await loginSuccess(null, false)
        console.log('response login:: ', response)
        if (!response?.error) {
          dispatch(setUser(response.data.metadata.user))
          dispatch(login())
        } else if (response) {
          console.log('response:: ', response)
          console.log('error response: ', response.error.data.message.strategy)
          if (location.pathname !== '/signup') navigate('/login')
          toast.warn(response.error.data.message.error)
        }
      }
      loginRequest()
    } else {
      console.log('else')
      const decodeToken = jwt_decode(accessToken)
      const now = new Date().getTime()
      if (decodeToken.exp * 1000 < now) {
        getProfile(null, false)
      } else {
        console.log('else')
        refreshToken()
      }
    }
  }, [])

  const routes = [...AppRouteList, ...AuthRouteList]
  console.log('all routes rerender: ', [...routes])
  return useRoutes([...routes])
}

export const WebRoutes = memo(AppRoutes)
