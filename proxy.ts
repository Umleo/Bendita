import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
//import { auth } from './app/lib/auth'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.pathname

  //REGRA 1 === Se o usuário tentar acessar a rota de login ou registro e já tiver um token de sessão válido, redireciona para a página inicial
  if (url.startsWith('/login') || url.startsWith('/registro')) {
    const token = request.cookies.get('better-auth.session_token')?.value
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //REGRA 2 === Se o usuário tentar acessar a rota /verifica e não tiver um email em localstorage, redireciona para a página de login

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //REGRA 3 === Rotas admin apenas podem ser acessadas por usuarios com role admin (verificar token e role no cookie ou header) 
  // if (url.startsWith('/admin')) {
  //   const session = await auth.api.getSession({
  //     headers: request.headers
  //   })

  //   const user = session?.user.role

  //   if (user !== 'admin') {
  //     return NextResponse.redirect(new URL('/login', request.url))
  //   }
  // }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    '/login/:path*',
    '/registro/:path*',
    //'/admin/:path*',
  ]
}


// // Pegamos a URL que o usuário está tentando acessar
//   const path = request.nextUrl.pathname

//   // Exemplo: Verificando acesso a uma rota protegida
//   if (path.startsWith('/admin')) {
//     // Aqui você buscaria seu cookie de sessão ou token JWT
//     const token = request.cookies.get('auth-token')?.value

//     if (!token) {
//       // Se não tem token, redireciona para a tela de login
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   }

//   // Se estiver tudo certo, a requisição segue o fluxo normal
//   return NextResponse.next()
// }

// // Opcional, mas altamente recomendado: O Matcher
// // Ele define em quais rotas o middleware deve ser executado, poupando processamento
// export const config = {
//   matcher: [
//     '/admin/:path*', 
//     '/pedidos/:path*'
//   ],
// }