# JWT 身份验证助手

该助手提供用于编码、解码、签名和验证 JSON Web Tokens (JWTs) 的函数。JWT 通常用于 Web 应用程序中的身份验证和授权。该助手提供强大的 JWT 功能，支持多种加密算法。

## 导入

要使用此助手，您可以按如下方式导入：

```ts
import { decode, sign, verify } from 'hono/jwt'
```

::: info
[JWT 中间件](/docs/middleware/builtin/jwt) 也从 `hono/jwt` 导入 `jwt` 函数。
:::

## `sign()`

此函数通过编码有效负载并使用指定的算法和密钥对其进行签名，从而生成一个JWT令牌。

```ts
sign(
  payload: unknown,
  secret: string,
  alg?: 'HS256';

): Promise<string>;
```

### 示例

```ts
import { sign } from 'hono/jwt'

const payload = {
  sub: 'user123',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
}
const secret = 'mySecretKey'
const token = await sign(payload, secret)
```

### 选项

<br/>

#### <Badge type="danger" text="必填" /> payload: `unknown`

要签名的JWT有效载荷。您可以包含其他声明，如在[有效载荷验证](#payload-validation)中所示。

#### <Badge type="danger" text="必填" /> secret: `string`

用于JWT验证或签名的密钥。

#### <Badge type="info" text="可选" /> alg: [AlgorithmTypes](#supported-algorithmtypes)

用于JWT签名或验证的算法。默认值为HS256。

## `verify()`

此函数检查 JWT 令牌是否真实且仍然有效。它确保令牌没有被更改，并仅在您添加了 [Payload Validation](#payload-validation) 时检查有效性。

```ts
verify(
  token: string,
  secret: string,
  alg?: 'HS256';
): Promise<any>;

```

### 示例

```ts
import { verify } from 'hono/jwt'

const tokenToVerify = 'token'
const secretKey = 'mySecretKey'

const decodedPayload = await verify(tokenToVerify, secretKey)
console.log(decodedPayload)
```

### 选项

<br/>

#### <Badge type="danger" text="必需" /> token: `string`

需要验证的 JWT 令牌。

#### <Badge type="danger" text="必需" /> secret: `string`

用于 JWT 验证或签名的密钥。

#### <Badge type="info" text="可选" /> alg: [AlgorithmTypes](#supported-algorithmtypes)

用于 JWT 签名或验证的算法。默认值为 HS256。

## `decode()`

此函数解码一个JWT令牌，而不执行签名验证。它从令牌中提取并返回头部和有效负载。

```ts
decode(token: string): { header: any; payload: any };
```

### 示例

```ts
import { decode } from 'hono/jwt'

// 解码 JWT 令牌
const tokenToDecode =
  'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAidXNlcjEyMyIsICJyb2xlIjogImFkbWluIn0.JxUwx6Ua1B0D1B0FtCrj72ok5cm1Pkmr_hL82sd7ELA'

const { header, payload } = decode(tokenToDecode)

console.log('解码后的头部:', header)
console.log('解码后的负载:', payload)
```

### 选项

<br/>

#### <Badge type="danger" text="必需" /> token: `string`

要解码的JWT令牌。

> `decode`函数允许您检查JWT令牌的头部和负载 _**而不**_ 执行验证。这对于调试或从JWT令牌中提取信息非常有用。

## 有效负载验证

在验证JWT令牌时，将执行以下有效负载验证：

- `exp`：检查令牌以确保它尚未过期。
- `nbf`：检查令牌以确保它在指定时间之前未被使用。
- `iat`：检查令牌以确保它未在未来发行。

如果您打算在验证期间执行这些检查，请确保您的JWT有效负载包含这些字段，作为一个对象。

## 自定义错误类型

该模块还定义了自定义错误类型以处理与 JWT 相关的错误。

- `JwtAlgorithmNotImplemented`: 表示请求的 JWT 算法未实现。
- `JwtTokenInvalid`: 表示 JWT 令牌无效。
- `JwtTokenNotBefore`: 表示令牌在其有效日期之前被使用。
- `JwtTokenExpired`: 表示令牌已过期。
- `JwtTokenIssuedAt`: 表示令牌中的 "iat" 声明不正确。
- `JwtTokenSignatureMismatched`: 表示令牌中的签名不匹配。

## 支持的算法类型

该模块支持以下 JWT 加密算法：

- `HS256`: HMAC 使用 SHA-256
- `HS384`: HMAC 使用 SHA-384
- `HS512`: HMAC 使用 SHA-512
- `RS256`: RSASSA-PKCS1-v1_5 使用 SHA-256
- `RS384`: RSASSA-PKCS1-v1_5 使用 SHA-384
- `RS512`: RSASSA-PKCS1-v1_5 使用 SHA-512
- `PS256`: RSASSA-PSS 使用 SHA-256 和 MGF1 结合 SHA-256
- `PS384`: RSASSA-PSS 使用 SHA-384 和 MGF1 结合 SHA-384
- `PS512`: RSASSA-PSS 使用 SHA-512 和 MGF1 结合 SHA-512
- `ES256`: ECDSA 使用 P-256 和 SHA-256
- `ES384`: ECDSA 使用 P-384 和 SHA-384
- `ES512`: ECDSA 使用 P-521 和 SHA-512
- `EdDSA`: EdDSA 使用 Ed25519