<?php
// bot.php
// Proxy dinâmico para web crawlers de redes sociais
// Este arquivo intercepta requisições do WhatsApp, Facebook, etc.,
// e exibe o HTML necessário para o "card" do link.

$supabaseUrl = 'https://pradoaqui.vendopro.com.br';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.nqb_unyHxgo3J_IBedTTuIiMHgeTG0v6UMmmZTHiG8s';

$requestUri = $_SERVER['REQUEST_URI'];
$slug = '';

// Extrair o slug da URL, ex: /blog/o-meu-post
if (preg_match('/^\/blog\/([^\/\?]+)/', $requestUri, $matches)) {
    $slug = $matches[1];
}

// Configurações padrão
$title = 'PradoAqui | Rio São Francisco ao Vivo';
$description = 'Sua experiência de pesca no Rio São Francisco começa aqui! Ranchos exclusivos e pacotes personalizados em Três Marias/MG.';
$image = 'https://pradoaqui.com.br/og-image.png'; // fallback
$url = 'https://pradoaqui.com.br' . $requestUri;

if ($slug) {
    // Buscar os dados do post no Supabase via REST API
    $endpoint = $supabaseUrl . '/rest/v1/blog_posts?slug=eq.' . urlencode($slug) . '&select=titulo,resumo,imagem_destaque';
    
    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabaseKey,
        'Authorization: Bearer ' . $supabaseKey
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode == 200 && $response) {
        $data = json_decode($response, true);
        if (is_array($data) && count($data) > 0) {
            $post = $data[0];
            $title = $post['titulo'] ? $post['titulo'] . ' | PradoAqui' : $title;
            $description = $post['resumo'] ?? $description;
            if (!empty($post['imagem_destaque'])) {
                // A imagem do banco pode estar usando o endpoint de transformação inativo,
                // então substituímos para o endpoint raw de objetos.
                $image = str_replace('/storage/v1/render/image/', '/storage/v1/object/', $post['imagem_destaque']);
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($description); ?>">

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="<?php echo htmlspecialchars($url); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($image); ?>">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="<?php echo htmlspecialchars($url); ?>">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($description); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($image); ?>">
</head>
<body>
    <script>
        // Fallback de segurança:
        // Caso um navegador humano caia acidentalmente nesta página
        // devido a alguma falha na identificação do User-Agent,
        // ele será redirecionado para carregar o React SPA corretamente.
        window.location.replace("<?php echo htmlspecialchars($url); ?>?no_bot=1");
    </script>
</body>
</html>
