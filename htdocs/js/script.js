$(document).ready(function () {
    JS.init();
    JS.load();
});

var JS = {
    init: function () {
        Elem.init();
        Device.init();
        Header.init();
        History.init();
        Parallax.init();
        SmoothScroll.init();
        Formulaire.init();
        Font.init();
        AdaptativeImage.init();
        MovingSprite.init();
    },
    load: function () {
        Elem.load();

        if (Elem.main.hasClass("withBlocJS"))
            Article.init();
        else if (Elem.main.hasClass("withBloc"))
            Bloc.render(false);

        SlideShow.load();
        PopIn.load();
        Gallery.load();
        AdaptativeImage.render();
        littleSlideShow.load();
        MovingSprite.resize();
        Genese.load();
    }
}

var Device = {
    isPaysage: false,
    isMobile: false,
    isTablette: false,
    isDesktop: false,
    init: function () {
        $(window).resize(Device.check)
        Device.check();
    },
    check: function () {
        Device.isPaysage = ($(window).width() > $(window).height());
        Device.isMobile = ($(window).width() < 768);
        Device.isTablette = ($(window).width() >= 768 && $(window).width() < 1110);
        Device.isDesktop = ($(window).width() >= 1110);
    }
}

var Elem = {
    init: function () {
        Elem.body = $("body");
        Elem.header = $("header");
        Elem.footer = $("footer");
        Elem.menu = $("#menu");
        Elem.burger = $(".burger");
        Elem.closeMenu = $(".closeMenu");
        Elem.nav = $("#menu nav");
    },
    load: function () {
        Elem.main = $("#main");
        Elem.contentAjax = $("#contentAjax");
    }
}

var Header = {
    init: function () {
        Header.injectTransitionLoading();
        $(document).on("scroll", function () {
            var currentTop = $(document).scrollTop();
            Header.checkStickyHeader(currentTop);
            Header.checkStickyFooter(currentTop);
        });
        Elem.burger.append('<span class="top parent"><span class="left"></span><span class="right"></span></span><span class="middle parent"><span class="left"></span><span class="right"></span></span><span class="bottom parent"><span class="left"></span><span class="right"></span></span>');
        Elem.burger.on("click", function () {
            Elem.header.toggleClass("open");
        });
        Elem.closeMenu.append('<span class="top left"></span><span class="top right"></span><span class="bottom left"></span><span class="bottom right"></span>');
        Elem.closeMenu.on("click", function () {
            Elem.header.toggleClass("open");
        });
        Elem.nav.find("a").each(function () {
            $(this).append("<span class='backHoverFond'>" + $.trim($(this).html()) + "</span><span class='backHoverTexte'>" + $.trim($(this).html()) + "</span>");
        });
        Elem.nav.find("a").on("click", function (e) {
            if (History.enabled) {
                e.preventDefault();
                History.changeURL($(this).attr("href"));
                $(this).toggleClass("selected").parents("li").eq(0).siblings().find("a").removeClass("selected");

                if ($(this).hasClass("filter") && Elem.main.hasClass("home")) {
                    Article.filterNews($(this).attr("href").toLowerCase().replace("/", ""), $(this).find(".backHoverTexte").html() + " - Alpine ");
                }
                else {
                    Elem.body.addClass("showTransition");
                    Header.transitionLoading.fadeIn();
                    $.ajax({ url: Config.path + $(this).attr("href"), dataType: "xml" }).done(function (data) {
                        var pageTitle = $("title", data).html();
                        document.title = pageTitle;
                        var contentAjax = $("#contentAjax", data).html();
                        Elem.contentAjax.html(contentAjax);

                        Elem.body.removeClass("showTransition");
                        Header.transitionLoading.fadeOut(function () {
                            JS.load();
                        });
                    });
                }
            }
        });
    },
    checkStickyHeader: function (thisTop) {
        Elem.header.toggleClass("sticky", thisTop > 20);
    },
    checkStickyFooter: function (thisTop) {
        Elem.footer.toggleClass("sticky", thisTop > 20);
    },
    injectTransitionLoading: function () {
        Header.transitionLoading = $("<div class='transitionLoading' />");
        Elem.body.append(Header.transitionLoading);
    }
}

var Bloc = {
    render: function (withShare) {
        if (withShare == undefined)
            withShare = true;
        if (Device.isMobile)
            Bloc.initMobile();

        $(".bloc:not(.loaded)").each(function (i) {
            $(this).css("transition-delay", (0.4 + (0.15 * i)) + "s").delay(1).queue(function () {
                $(this).addClass("loaded").dequeue();
                Bloc.removeDelay(this);
            });

            if (withShare)
                Bloc.addShare($(this));

            if (!$(this).hasClass("nobarre"))
                $(this).find($(this).find(".titre").length > 0 ? ".titre" : ".cat").prepend("<span class='traitParent'><span class='traitEnfant'></span></span>");
        });
    },
    removeDelay: function (elem) {
        setTimeout(function () {
            $(elem).css("transition-delay", "");
        }, 2000);
    },
    initMobile: function () {
        $(".bloc").each(function () {
            var thisStyle = $(this).find(".infos").attr("style");
            if (thisStyle != undefined) {
                if (thisStyle.indexOf("right") > -1)
                    $(this).addClass("mobileRight");
                else if (thisStyle.indexOf("left") > -1)
                    $(this).addClass("mobileLeft");

                if (thisStyle.indexOf("bottom") > -1)
                    $(this).addClass("mobileBottom");
                else if (thisStyle.indexOf("top") > -1)
                    $(this).addClass("mobileTop");
            }
        });
    },
    addShare: function (bloc) {
        var parent = bloc.parents(".template");
        var template = parent.data("template");
        if (Template.liste[template] != undefined && Template.liste[template].share == 1 && parent.find(".share").length == 0) {
            parent.addClass("withShare");
            var uiShare = "<ul class='share'>"
                        + "<li class='facebook'><a href='http://www.facebook.com'><img src='img/logo_share_facebook.png' alt='Facebook'></a></li>"
                        + "<li class='instagram'><a href='javascript:void(0)'><img src='img/logo_share_instagram.png' alt='Instagram'></a></li>"
                        + "<li class='twitter'><a href='javascript:void(0)'><img src='img/logo_share_twitter.png' alt='Twitter'></a></li>"
                        + "<li class='email'><a href='javascript:void(0)'><img src='img/logo_share_email.png' alt='Email'></a></li>"
                        + "</ul>";
            if (Device.isMobile) {
                uiShare += "<a class='mobileShare onlyMobile'></a><a class='mobileShareClose onlyMobile'></a>";
                Elem.main.on("click", ".mobileShare", function () {
                    $(this).parents(".bloc").eq(0).addClass("mobileClicked");
                    $(this).parents(".template").siblings(".template").find(".bloc").removeClass("mobileClicked");
                });
                Elem.main.on("click", ".mobileShareClose", function () {
                    $(this).parents(".bloc").eq(0).removeClass("mobileClicked");
                });
            }

            var thisPos = Template.liste[template].sharePos;
            if (parent.find(".bloc").length <= thisPos)
                thisPos = 0;
            parent.find(".bloc").eq(thisPos).prepend($(uiShare));
        }
    }
}

var Template = {
    liste: {
        "article_1": {
            "share": 1,
            "sharePos": 0
        },
        "video_1": {
            "share": 0,
            "sharePos": 0
        },
        "illustration_facultative": {
            "share": 0,
            "sharePos": 0
        },
        "twitter": {
            "share": 0,
            "sharePos": 0
        },
        "article_3": {
            "share": 1,
            "sharePos": 2
        },
        "article_2": {
            "share": 1,
            "sharePos": 0
        },
        "illustration": {
            "share": 0,
            "sharePos": 0
        },
        "contact": {
            "share": 0,
            "sharePos": 0
        }
    }
}

var Article = {
    lastAction: "",
    nbCols: 3,
    nbLines: 3,
    init: function () {
        Article.loadJSON();
        Article.sortNews(Elem.main.filter(".withBloc").find(".template"));
    },
    filterNews: function (action, title) {
        if (Article.lastAction == action || action == "") {
            action = "";
            document.title = Config.defaultTitle;
            History.replaceURL(Config.defaultPath);
            Article.sortNews($("div.template", Article.Data));
        }
        else {
            document.title = title;
            Article.sortNews($("div.template[data-tags*='" + action + "']", Article.Data));
        }
        Article.lastAction = action;
    },
    sortNews: function (liste) {
        Article.currentListe = liste;
        Article.removeNews(function () {
            Elem.main.find(".template").remove();
            Elem.main.prepend(Article.currentListe);
            Article.showPage();
        });
    },
    removeNews: function (callback) {
        var nbBlocRemoved = 0;
        Elem.main.find(".template").each(function () {
            if (Article.currentListe.filter("[id='" + $(this).attr("id") + "']").length == 0) {
                nbBlocRemoved++;
                $(this).addClass("toRemove");
            }
        });
        setTimeout(callback, (nbBlocRemoved == 0 ? 0 : 600));
    },
    showPage: function (lastID) {
        Bloc.render();
    },
    loadJSON: function () {
        $.ajax({ url: Config.listeArticle, dataType: "text" }).done(function (data) {
            Article.Data = data;
        });
    }
}

var History = {
    init: function () {
        History.enabled = (window.history && history.pushState);
        if (History.enabled) {
            $(window).on("popstate", function (e) {
                var action = document.location.href.substring(document.location.href.lastIndexOf("/"));
                var currentNav = Elem.nav.find("a[href='" + action + "']");

                //A Modifier, les urls ne sont pas que la home filtrée
                if (currentNav.length == 0) {
                    Elem.nav.find("a").removeClass("selected");
                    Article.filterNews("", Config.defaultTitle);
                } else {
                    currentNav.addClass("selected").parents("li").eq(0).siblings().find("a").removeClass("selected");
                    Article.filterNews(action.toLowerCase().replace("/", ""), currentNav.find(".backHoverTexte").html() + " - Alpine ");
                }
            });
        }
    },
    changeURL: function (url) {
        history.pushState(null, null, Config.path + url);
    },
    replaceURL: function (url) {
        history.replaceState(null, null, Config.path + url);
    }
}

var Parallax = {
    init: function () {
        $(document).on("scroll", Parallax.setPosition);
    },
    setPosition: function () {
        $(".parallax").each(function () {
            if ($(this).hasClass("box")) {
                var diffScroll = -(($(document).scrollTop() + $(window).height() / 2) - ($(this).offset().top + $(this).height() / 2)) / 3;
                $(this).css("top", diffScroll + "px");
            }
            else {
                var diffScroll = -(($(document).scrollTop() + $(window).height() / 2) - ($(this).offset().top + $(this).height() / 2)) / 3;
                $(this).css("background-position", "center " + diffScroll + "px");
            }
        });
    }
}

var SlideShow = {
    load: function () {
        $(".template.slideshow .bloc").each(function () {
            new SlideShow.slide($(this));
        });
    },
    slide: function (slide) {
        var elem = this;
        elem.currentParent = slide;
        elem.currentListe = slide.find("li");
        elem.isMoving = false;
        elem.blocLegende = undefined;
        elem.lastSlide = elem.currentSlide = 0;
        elem.timeAnimation = 500;

        if (elem.currentParent.find(".legende")) {
            elem.blocLegende = $("<div class='blocLegende' />");
            elem.blocLegende.insertAfter(elem.currentParent);
        }

        if (elem.currentListe.length > 1) {
            var btnNext = $("<div class='button next'><span class='fondBefore'></span><span class='fondAfter'></span><a href='javascript:void(0)'>></a></div>").on("click", function () {
                if (!elem.isMoving) {
                    elem.goPage(1, true);
                }
            });
            var btnPrev = $("<div class='button prev'><span class='fondBefore'></span><span class='fondAfter'></span><a href='javascript:void(0)'><</a></div>").on("click", function () {
                if (!elem.isMoving) {
                    elem.goPage(-1, true);
                }
            });

            elem.navSlide = $("<ul class='navSlide' />");
            for (var i = 0 ; i < elem.currentListe.length ; i++)
                elem.navSlide.append("<li></li>");
            elem.currentParent.append(btnPrev).append(btnNext).append(elem.navSlide);
            elem.navSlide.on("click", "li", function () {
                elem.currentSlide = elem.navSlide.find("li").index($(this));
                if (!elem.isMoving)
                    elem.goPage(0, true);
            });
        }
        elem.goPage = function (sens, withAnim) {
            if (sens != 0)
                elem.currentSlide = (elem.currentSlide + sens + elem.currentListe.length) % elem.currentListe.length;
            else
                sens = Math.abs(elem.currentSlide - elem.lastSlide) / (elem.currentSlide - elem.lastSlide);

            if (withAnim) {
                elem.isMoving = true;
                elem.navSlide.find("li").eq(elem.lastSlide).addClass("to" + sens).removeClass("current");
                elem.navSlide.find("li").eq(elem.currentSlide).removeClass("to1 to-1").addClass("from" + sens).delay(1).queue(function () {
                    $(this).addClass("current").removeClass("from" + sens).dequeue();
                });

                elem.currentListe.eq(elem.currentSlide).css({ "left": sens * 100 + "%" }).show().animate({ "left": "0%" }, elem.timeAnimation);
                elem.currentListe.eq(elem.lastSlide).animate({ "left": -sens * 100 + "%" }, elem.timeAnimation, function () {
                    $(this).hide();
                    elem.lastSlide = elem.currentSlide;
                    elem.isMoving = false;
                });

                elem.blocLegende.addClass("hidden");
                setTimeout(function () {
                    elem.blocLegende.children().remove();
                    elem.blocLegende.append(elem.currentListe.eq(elem.currentSlide).find(".legende").html()).removeClass("hidden");
                }, elem.timeAnimation / 2);
            }
            else {
                elem.currentListe.eq(elem.currentSlide).show().siblings().hide();
                elem.navSlide.find("li").eq(elem.currentSlide).addClass("current").siblings().removeClass("current");

                elem.blocLegende.children().remove();
                elem.blocLegende.append(elem.currentListe.eq(elem.currentSlide).find(".legende").html());
            }
        };
        elem.goPage(0, false);
    }
}

var SmoothScroll = {
    init: function () {
        //From http://codepen.io/anon/pen/xZpPWa
        var $window = $(window);		//Window object
        var scrollTime = 0.4;			//Scroll time
        var scrollDistance = 200;		//Distance. Use smaller value for shorter scroll and greater value for longer scroll

        $window.on("mousewheel DOMMouseScroll", function (event) {
            event.preventDefault();
            var delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
            var scrollTop = $window.scrollTop();
            var finalScroll = scrollTop - parseInt(delta * scrollDistance);
            TweenLite.to($window, scrollTime, {
                scrollTo: { y: finalScroll, autoKill: true },
                ease: Power1.easeOut,
                autoKill: true,
                overwrite: 5
            });
        });
    }
}

var PopIn = {
    load: function () {
        PopIn.listePop = {};

        Elem.body.find(".storePop").each(function () {
            PopIn.listePop[$(this).attr("id")] = $(this).clone();
            $(this).remove();
        });

        Elem.body.on("click", ".openPop", function () {
            var type = $(this).data("typepop");
            var templatePopin = PopIn.getTemplate(type);

            if (type == "youtube")
                templatePopin.find(".boxContent").append('<iframe src="https://www.youtube.com/embed/' + $(this).data("video") + '?rel=0&amp;showinfo=0&amp;wmode=transparent&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');
            else if (type == "contactForm")
                templatePopin.find(".boxContent").append(PopIn.listePop["contactForm"].clone().removeClass("invis"));

            Elem.body.append(templatePopin);
            templatePopin.fadeIn();
        });
    },
    getTemplate: function (type) {
        var template = $("<div class='popin " + type + "'><div class='box'><a class='close' href='javascript:void(0)'></a><div class='boxContent'></div></div></div>");
        template.on("click", ".close", function () {
            template.fadeOut(function () {
                $(this).remove();
            });
        });
        return template;
    }
}

var Gallery = {
    load: function () {
        $("#intro .filters li").append("<span class='picto'><span class='left'></span><span class='right'></span><span class='top'></span><span class='bottom'></span></span>");
        Gallery.listeMedia = $("#main.withMedia .bloc").clone();
        $("#intro .filters li").on("click", function () {
            $(this).toggleClass("selected");
            $("#main.withMedia .bloc").remove();
            $("#main.withMedia").append(Gallery.listeMedia.clone());
            $("#main.withMedia .bloc").each(function () {
                if (!$("#intro .filters a." + $(this).data("filter")).parent().hasClass("selected"))
                    $(this).remove();
            });
            Bloc.render(false);
        });
    }
}

var Formulaire = {
    init: function () {
        Elem.body.on("focus", ".boxTexte input", function () {
            $(this).parents(".champs").eq(0).addClass("focus");
        });
        Elem.body.on("blur", ".boxTexte input", function () {
            $(this).parents(".champs").eq(0).removeClass("focus");
        });
        Elem.body.on("click", "a.submitForm", function () {
            var isOK = true;

            var thisForm = $(this).parents("form").eq(0);
            thisForm.find(".toCheck").each(function () {
                var thisRequiredOk = true;
                var thisFormatOk = true;

                var thisParent = $(this).parents(".champs").eq(0);
                if (thisParent.data("required")) {
                    if ($(this).hasClass("text") && $.trim($(this).val()) == "")
                        thisRequiredOk = false;
                    else if ($(this).hasClass("radio") && Formulaire.checkRadio($(this).parents("form").eq(0), $(this).attr("name")))
                        thisRequiredOk = false;
                }

                if (thisParent.data("format") == "email" && !Formulaire.checkEmail($(this).val()))
                    thisFormatOk = false;

                var msgError = thisParent.find("p.error");

                if (thisRequiredOk && thisFormatOk) {
                    thisParent.removeClass("error");
                    msgError.html("&nbsp;");
                }
                else {
                    thisParent.addClass("error");
                    if (!thisFormatOk)
                        msgError.html(thisParent.data("format-error"));
                    if (!thisRequiredOk)
                        msgError.html(thisParent.data("required-error"));
                    isOK = false;
                }
            });

            if (isOK) {
                $.ajax({ method: thisForm.attr("method"), url: thisForm.attr("action"), data: thisForm.serialize() }).done(function (data) {
                    alert(data);
                });
            }
        });
    },
    checkEmail: function (chaine) {
        var pattern = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
        return pattern.test(chaine);
    },
    checkRadio: function (form, name) {
        return (form.find(".radio[name='" + name + "']:checked").length > 0 ? false : true)
    }
}

var Font = {
    init: function () {
        $(window).resize(Font.resize);
        Font.resize();
    },
    resize: function () {
        if (Device.isMobile)
            Elem.body.css("font-size", $(window).width() / 20 + "px");
        else if (Device.isTablette && !Device.isPaysage)
            Elem.body.css("font-size", $(window).width() / 48 + "px");
        else if (Device.isTablette && Device.isPaysage)
            Elem.body.css("font-size", $(window).width() / 69.375 + "px");
        else
            Elem.body.css("font-size", "");
    }
}

var littleSlideShow = {
    load: function () {
        $(".article_listeVisuel").each(function () {
            var parent = $(this);
            var nbBloc = parent.find(".itemSlide").length;
            var ui = $("<ul class='littleSlideNav onlyMobile' />");
            for (var i = 0 ; i < nbBloc ; i++)
                ui.append("<li />");

            $(window).resize(function () {
                littleSlideShow.resize(parent, nbBloc);
            });
            littleSlideShow.resize(parent, nbBloc);

            ui.find("li").eq(0).addClass("current");
            ui.find("li").on("click", function () {
                littleSlideShow.goPage(parent, nbBloc, $(this).parent().children().index($(this)));
            });

            parent.children().on("swipeleft", function (e) {
                var nextIndex = parent.next(".littleSlideNav").find("li").index(parent.next(".littleSlideNav").find("li.current")) + 1;
                nextIndex = (nextIndex >= nbBloc ? nbBloc : nextIndex);
                littleSlideShow.goPage(parent, nbBloc, nextIndex);
            });

            parent.children().on("swiperight", function (e) {
                var nextIndex = parent.next(".littleSlideNav").find("li").index(parent.next(".littleSlideNav").find("li.current")) - 1;
                nextIndex = (nextIndex <= 0 ? 0 : nextIndex);
                littleSlideShow.goPage(parent, nbBloc, nextIndex);
            });

            ui.insertAfter(parent);
        });
    },
    resize: function (parent, nbBloc) {
        if (Device.isMobile) {
            parent.find(".container").css("width", 92.1875 * nbBloc + "%");
            parent.find(".itemSlide").css("width", 99.99 / nbBloc + "%");
        }
        else {
            parent.find(".container").css("width", "");
            parent.find(".itemSlide").css("width", "");
        }
    },
    goPage: function (parent, nbBloc, index) {
        var scrollMax = parent.find(".container").width() - $(window).width();
        var thisScroll = (index / (nbBloc - 1)) * scrollMax;
        parent.animate({ scrollLeft: thisScroll }, 500);
        parent.next(".littleSlideNav").find("li").eq(index).addClass("current").siblings().removeClass("current");
    }
}

var AdaptativeImage = {
    init: function () {
        $(window).resize(AdaptativeImage.render);
        AdaptativeImage.render();
    },
    render: function () {
        $("img.withAdaptativeImage").each(function () {
            var data = $(this).data("image");

            if (Device.isMobile && data.mobile != undefined)
                $(this).attr("src", data.mobile);
            else if (Device.isTablette && data.tablette != undefined)
                $(this).attr("src", data.tablette);
            else if (Device.isDesktop && data.desktop != undefined)
                $(this).attr("src", data.desktop);
        });

        $("div.withAdaptativeImage").each(function () {
            var data = $(this).data("image");

            if (Device.isMobile && data.mobile != undefined && data.mobile != "")
                $(this).css("background-image", "url(" + data.mobile + ")");
            else if (Device.isTablette && !Device.isPaysage && data.tablette != undefined && data.tablette != "")
                $(this).css("background-image", "url(" + data.tablette + ")");
            else if ((Device.isDesktop || (Device.isTablette && Device.isPaysage)) && data.desktop != undefined && data.desktop != "")
                $(this).css("background-image", "url(" + data.desktop + ")");
            else
                $(this).css("background-image", "");
        });
    }
}

var MovingSprite = {
    init: function () {
        $(window).resize(MovingSprite.resize);
        MovingSprite.resize();
        $(document).on("scroll", MovingSprite.setPosition);
    },
    resize: function () {
        $(".floating").each(function () {
            $(this).css({ "top": "", "left": "" });
            $(this).data("left", parseInt($(this).css("left")));
            $(this).data("top", parseInt($(this).position().top));
            $(this).data("offsetTop", parseInt($(this).offset().top));
        });
        MovingSprite.setPosition();
    },
    setPosition: function () {
        $(".floating").each(function () {
            var percentLine = ($(this).data("percent") == undefined ? 0.6 : $(this).data("percent"));
            var positionVisible = $(document).scrollTop() + percentLine * $(window).height();
            var diffScroll = positionVisible - $(this).data("offsetTop");

            if (diffScroll > 0) {
                var vectorX = $(this).data("move-width") / 200;
                var vectorY = $(this).data("move-height") / 200;
                var currentX = vectorX * diffScroll + $(this).data("left");
                var currentY = vectorY * diffScroll + $(this).data("top");
                $(this).css({ "left": currentX, "top": currentY });

                $(this).find(".ombre").css("top", -diffScroll / 10);
            }
            else {
                $(this).css({ "top": "", "left": "" });
                $(this).find(".ombre").css("top", "");
            }
        });
    }
}

var Genese = {
    load: function () {
        $("#main .baseline").each(function () {
            $(this).find("br").each(function (index) {
                for (var i = 0 ; i <= index ; i++)
                    $("<span class='indent' />").insertAfter($(this));
            });
        });
    }
}

//var Timeline = {
//    init: function () {
//        $(".timeline").each(function () {
//            new Timeline.time($(this));
//        });
//    },
//    time: function (bloc) {
//        var elem = this;
//        elem.parent = bloc;
//        elem.currentImage = 0;
//        elem.background = bloc.find(".sprite");
//        elem.nbCol = elem.background.data("col");
//        elem.nbLine = elem.background.data("line");
//        elem.spriteHeight = elem.background.data("height");
//        elem.spriteWidth = elem.background.data("width");
//        elem.degree = $("<div class='degree' />");
//        elem.rule = $("<div class='rule' />");
//        elem.cursor = $("<div class='cursor' />");
//        elem.line = $("<div class='line' />");
//        elem.parent.append(elem.degree);
//        elem.parent.append(elem.rule);
//        elem.rule.append(elem.cursor);
//        elem.rule.append(elem.line);
//        elem.ruleOn = false;

//        elem.cursor.on("mousedown", function () {
//            console.log("down");
//            elem.ruleOn = true;
//        });

//        elem.cursor.on("mouseup", function () {
//            console.log("up");
//            elem.ruleOn = false;
//        });

//        elem.rule.on("click", function () {

//        });

//        elem.parent.on("mousemove", function (e) {
//            if (elem.ruleOn) {
//                var indexSprite = Math.floor(180 * (e.pageX - elem.parent.offset().left) / elem.parent.outerWidth(true));
//                elem.goSprite(indexSprite, false);
//            }
//        });

//        elem.goSprite = function (index, withAnim) {
//            elem.currentImage = index;
//            var xPos = -elem.spriteWidth * (++elem.currentImage % elem.nbCol);
//            var yPos = -elem.spriteHeight * (Math.floor(elem.currentImage / elem.nbCol));

//            elem.parent.css("background-position", xPos + "px " + yPos + "px");
//            elem.parent.css("background-size", "" + (elem.nbCol * 100) + "% " + (elem.nbLine * 100) + "%");
//            elem.parent.css("background-image", "url(" + elem.background.attr("src") + ")");
//        }
//    }
//}