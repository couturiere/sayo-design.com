const CENTER_LAT = $items.eq(0).data('lat');
        const CENTER_LNG = $items.eq(0).data('lng');
        const ICON_W = 58/2;
        const ICON_H = 72/2;
        let map;
        let marker = [];
        let infoWindow = [];

        function init() {
            if($('#js-city-section__map-canvas').length < 1) {
                return;
            }
            let mapOptions = {
                center: new google.maps.LatLng(CENTER_LAT, CENTER_LNG),
                zoom: (window.UA.isSP)? 15 :16,
                zoomControl: true,
                disableDoubleClickZoom: false,
                mapTypeControl: true,
                scaleControl: true,
                scrollwheel: false,
                panControl: true,
                streetViewControl: false,
                draggable : true,
                overviewMapControl: false,
                overviewMapControlOptions: {
                    opened: false
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            let mapElement = document.getElementById('js-city-section__map-canvas');
            map = new google.maps.Map(mapElement, mapOptions);
            //ピンの設置
            for(let i = 0; i < $items.length; i++) {
                let $item = $items.eq(i);
                let markerLatLng = new google.maps.LatLng({
                    lat: parseFloat($item.data('lat')),
                    lng: parseFloat($item.data('lng'))
                }); // 緯度経度のデータ作成
                let iconClass = (i === 0)? '.spot-list__icon-current': '.spot-list__icon-normal';
                marker[i] = new google.maps.Marker({ // マーカーの追加
                    animation: google.maps.Animation.DROP,
                    position: markerLatLng, // マーカーを立てる位置を指定
                    map: map, // マーカーを立てる地図を指定
                    icon: {
                        url: $item.find(iconClass).attr('src'),// マーカーの画像を変更
                        scaledSize : new google.maps.Size(ICON_W, ICON_H)
                    }
                });

                let $icon = '<i class="icon icon-link-mini"></i>';
                let $blank = '';
                if($item.find('.spot-list__arrow').attr('target') === '_blank') {
                    $icon = '<i class="icon icon-blank"></i>';
                    $blank = 'target=_blank';
                }
                infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
                    content: `<div class="map-popup"><a href="${$item.find('.spot-list__arrow').attr('href')}" ${$blank}><p><strong>${$item.find('.spot-list__title-jp').text()}</strong></p><p><small>${$item.find('.spot-list__title-en').text()}</small>${$icon}</p></a></div>`
                });

                markerEvent(i); // マーカーにクリックイベントを追加
            }
            infoWindow[0].open(map, marker[0]);
        }
        // マーカーにクリックイベントを追加
        function markerEvent(i) {
            marker[i].addListener('click', function() { // マーカーをクリックしたとき
                closeInfoWindow();
                infoWindow[i].open(map, marker[i]); // 吹き出しの表示
                //マーカー色変更
                changeIcon(i);
                //リストの色変更
                changeCurrent(i);
            });
        }
        function panToSelectedMap(i) {
            //選択したcenterに移動
            let $list = $items.eq(i);
            map.panTo(new google.maps.LatLng($list.data('lat'), $list.data('lng')));
            closeInfoWindow();
            infoWindow[i].open(map, marker[i]);
        }
        function moveMapOffsetTop() {
            //地図の上部までスクロール
            $('html, body').stop().animate({
                scrollTop: $('#js-city-section__map-box').offset().top - 130
            });
        }
        function closeInfoWindow() {
            for(let i = 0; i < infoWindow.length; i++) {
                infoWindow[i].close(map, marker[i]);
            }
        }
        function changeCurrent(i) {
            let $list = $items.eq(i);
            $items.removeClass('is-current');
            $list.addClass('is-current');
            changeIcon(i);
        }
        function changeIcon(i) {
            let iconClass = null;
            for(let k = 0; k < marker.length; k++) {
                if(k === i) {
                    iconClass = '.spot-list__icon-current';
                } else {
                    iconClass = '.spot-list__icon-normal';
                }
                marker[k].setOptions({
                    icon: {
                        url: $items.eq(k).find(iconClass).attr('src'),// マーカーの画像を変更
                        scaledSize : new google.maps.Size(ICON_W, ICON_H)
                    }
                });
            }
        }


        init();