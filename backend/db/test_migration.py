from db.models.ad import AdData, Redirect, AdDto, ProductDetail
from db.mongo import upsert_data, ads_collection

def prepare_test_data() -> AdDto:
    ad_data = AdData(
        title="Best Pizza Campaign",
        name="DummyPizza",
        video="https://media.thetavideoapi.com/org_tr8r9f7yjyv6m7g2ftmwrkk3r3xd/srvacc_atkkrghauxi3hi61xhdza6g8g/video_nm64vffccqi9uhp2aqza85cwpt/master.m3u8",
        greetings="Hello! We hope you enjoyed our promo. You can skip this or, if you'd like to learn more about our product, I'm here to assist you!",
        banner_url="https://img.humaads.live/poster.jpg",
        redirect=Redirect(message="You can call on the number given on poster behind me. It was amazing to interect with you. You can click on skip button to continue watching!", url=""),
        product_details=[
            ProductDetail("https://img.humaads.live/6.jpg", "Our pizza franchise is dedicated to delivering the finest pizzas crafted with love and passion.", "About the Brand"),
            ProductDetail("https://img.humaads.live/5.jpg", "Established over two decades ago, our brand has become synonymous with quality and taste.", "About the Brand"),
            ProductDetail("https://img.humaads.live/7.jpg", "We prioritize customer satisfaction, ensuring every slice is a delightful experience.", "About the Brand"),
            ProductDetail("https://img.humaads.live/4.jpg", "Our mission is to bring people together through the joy of sharing a delicious pizza.", "About the Brand"),
            ProductDetail("https://img.humaads.live/1.jpg", "We pride ourselves on using only the freshest and highest-quality ingredients in all our pizzas.", "About the Brand"),
            ProductDetail("https://img.humaads.live/2.jpg", "Our signature pizza dough is made fresh daily, ensuring a perfect crust every time.", "Recipes and Ingredients"),
            ProductDetail("https://img.humaads.live/3.jpg", "We source our tomatoes from the finest farms, guaranteeing a rich and flavorful sauce.", "Recipes and Ingredients"),
            ProductDetail("https://img.humaads.live/13.jpg", "Our cheese blend is a secret recipe, combining multiple cheeses for a unique taste.", "Recipes and Ingredients"),
            ProductDetail("https://img.humaads.live/10.jpg", "All our meats are locally sourced and free from artificial preservatives.", "Recipes and Ingredients"),
            ProductDetail("https://img.humaads.live/16.jpg", "We offer a variety of vegetarian and vegan options, made with fresh, organic ingredients.", "Recipes and Ingredients"),
            ProductDetail("https://img.humaads.live/10.jpg", "Our gourmet pizzas feature a range of exotic toppings, from truffle oil to arugula.", "Recipes and Ingredients"),
            ProductDetail("https://img.humaads.live/16.jpg", "Quality control is a top priority; each pizza undergoes rigorous checks before it reaches your table.", "Quality and Standards"),
            ProductDetail("https://img.humaads.live/16.jpg", "We follow strict hygiene practices, ensuring a clean and safe kitchen environment.", "Quality and Standards"),
            ProductDetail("https://img.humaads.live/9.jpg", "Our chefs are trained professionals, committed to maintaining the highest culinary standards.", "Quality and Standards"),
            ProductDetail("https://img.humaads.live/16.jpg", "We use eco-friendly packaging, reflecting our commitment to sustainability.", "Quality and Standards"),
            ProductDetail("https://img.humaads.live/12.jpg", "Customer feedback is crucial to us; we constantly improve based on your suggestions.", "Quality and Standards"),
            ProductDetail("https://img.humaads.live/12.jpg", "Try our classic Margherita, a timeless favorite with a perfect balance of sauce and cheese.", "Menu Highlights"),
            ProductDetail("https://img.humaads.live/11.jpg", "Our Meat Lover's Pizza is packed with premium cuts of pepperoni, sausage, and ham.", "Menu Highlights"),
            ProductDetail("https://img.humaads.live/11.jpg", "For a spicy kick, the Inferno Pizza features jalapeños, spicy sausage, and hot sauce.", "Menu Highlights"),
            ProductDetail("https://img.humaads.live/1.jpg", "The Veggie Supreme is loaded with fresh vegetables, offering a burst of flavor in every bite.", "Menu Highlights"),
            ProductDetail("https://img.humaads.live/14.jpg", "Indulge in our dessert pizzas, like the Nutella and Banana or the S'mores Delight.", "Menu Highlights"),
            ProductDetail("https://img.humaads.live/11.jpg", "Enjoy our daily lunch specials, offering great value for money.", "Specials and Offers"),
            ProductDetail("https://img.humaads.live/16.jpg", "We have weekly promotions and discounts for our loyal customers.", "Specials and Offers"),
            ProductDetail("https://img.humaads.live/16.jpg", "Sign up for our rewards program to earn points with every purchase.", "Specials and Offers"),
            ProductDetail("https://img.humaads.live/13.jpg", "Family meal deals provide a perfect feast for gatherings and celebrations.", "Specials and Offers"),
            ProductDetail("https://img.humaads.live/13.jpg", "Take advantage of our happy hour deals, featuring discounted drinks and appetizers.", "Specials and Offers"),
            ProductDetail("https://img.humaads.live/15.jpg", "We actively support local communities through charity events and sponsorships.", "Community and Culture"),
            ProductDetail("https://img.humaads.live/15.jpg", "Our franchise is known for its friendly and welcoming atmosphere.", "Community and Culture"),
            ProductDetail("https://img.humaads.live/15.jpg", "We host regular events, from pizza-making classes to live music nights.", "Community and Culture"),
            ProductDetail("https://img.humaads.live/15.jpg", "Our staff is like family, dedicated to providing excellent service.", "Community and Culture"),
            ProductDetail("https://img.humaads.live/15.jpg", "We believe in giving back; a portion of our profits goes to local food banks.", "Community and Culture"),
        ]
    )
    ad = AdDto(data=ad_data, on_chain_id=0, user_address="0x7896d9e85Cfed5Ab60E0Fc802cA4419629b3D3F8")
    upsert_data({"on_chain_id": 0}, ad, ads_collection)
    return ad
    
    