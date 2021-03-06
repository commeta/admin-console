<?php
# Реализация логики главной страницы

// Если есть то отдаем из кэша страницу, и обработаем заголовок if modified since
if($cached_page = get_cached_page( $urlMd5 )){
	ifMofifiedSince( $urlMd5 );
	die($cached_page);
}

$db->orderBy("img_order","Asc");
$db->where("parent_id", $md_meta['id']); // Запрос изображений из БД
$md_meta_img= $db->get("md_meta_img", null, ['img_src','img_alt','img_type', 'img_order']);

$slider = array_filter($md_meta_img, fn($k) => $k['img_type'] == 'slider'); // Изображения для слайдера

$db->orderBy("field_order","Asc");
$db->where("parent_id", $md_meta['id']); // Запрос дополнительных полей из БД
$md_meta_additional_fields= $db->get("md_meta_additional_fields", null, ['img_src','img_alt','field_type', 'field_header', 'field_content', 'field_link_url', 'field_link_title', 'field_order']);

$paragraph = array_filter($md_meta_additional_fields, fn($k) => $k['field_type'] == 'paragraph');
$info = array_filter($md_meta_additional_fields, fn($k) => $k['field_type'] == 'info');

require_once('chanks/header.php');
?>
<main role="main">

	<div id="myCarousel" class="carousel slide" data-ride="carousel">
		<ol class="carousel-indicators">
			
<?php
foreach($slider as $slide){
	$active= $slide['img_order'] == 1 ? 'class="active"' : '';
	printf('<li data-target="#myCarousel" data-slide-to="%d" %s></li>',$slide['img_order'],$active);
}
?>

		</ol>
		<div class="carousel-inner">
			
<?php
foreach($slider as $slide){
	$active= $slide['img_order'] == 1 ? 'active' : '';
	echo <<<SLIDE
			<div class="carousel-item {$active}">
				<img class="slide" src="{$slide['img_src']}" alt="{$slide['img_alt']}">
			</div>
	
SLIDE;
}
?>

		</div>
		<a class="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev"> <span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="sr-only">Предыдущий</span> </a>
		<a class="carousel-control-next" href="#myCarousel" role="button" data-slide="next"> <span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="sr-only">Следующий</span> </a>
	</div>
	<!-- Marketing messaging and featurettes
			  ================================================== -->
	<!-- Wrap the rest of the page in another container to center all the content. -->
	<div class="container marketing">
		<!-- Three columns of text below the carousel -->
		<div class="row">
			
<?php
foreach($info as $inf){
	$inf['field_content']= nl2br($inf['field_content']);
	echo <<<INFO
	
			<div class="col-lg-4"> <img class="rounded-circle" src="{$inf['img_src']}" alt="{$inf['img_alt']}" width="140" height="140">
				<h2>{$inf['field_header']}</h2>
				<p>{$inf['field_content']}</p>
				<p><a class="btn btn-secondary" href="{$inf['field_link_url']}" role="button">{$inf['field_link_title']}</a></p>
			</div>
			<!-- /.col-lg-4 -->
	
INFO;
}
?>

		</div>
		<!-- /.row -->
		<!-- START THE FEATURETTES -->
		
<?php
foreach($paragraph as $p){
	$ordermd1= $p['field_order'] % 2 ? 'order-md-1' : '';
	$ordermd2= $p['field_order'] % 2 ? 'order-md-2' : '';
	$p['field_content']= nl2br($p['field_content']);
	echo <<<INFO
	
		<hr class="featurette-divider">
		<div class="row featurette">
			<div class="col-md-7 {$ordermd2}">
				<h2 class="featurette-heading">{$p['field_header']}</h2>
				<p class="lead">{$p['field_content']}</p>
			</div>
			<div class="col-md-5 {$ordermd1}">
				<a data-fancybox="gallery" href="{$p['field_link_url']}">
					<img class="featurette-image img-fluid mx-auto" src="{$p['img_src']}" alt="{$p['img_alt']}">
				</a>
			</div>
		</div>
	
INFO;
}
?>
		
		<hr class="featurette-divider">
		<!-- /END THE FEATURETTES -->
	</div>
	<!-- /.container -->
</main>

<?php
require_once('chanks/footer.php');
set_cached_page($urlMd5); // Сохраним страницу в кэше
?>
