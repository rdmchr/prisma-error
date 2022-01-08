import { arg, extendType, list, objectType } from "nexus";
import { Recipe } from "nexus-prisma";

export const recipeSchema = objectType({
  name: Recipe.$name,
  description: Recipe.$description,
  definition(t) {
    t.field(Recipe.id);
    t.field(Recipe.name);
    t.field(Recipe.description);
    t.field(Recipe.createdAt);
    t.field(Recipe.updatedAt);
    t.list.field("Ingredients", {
      type: "Ingredient",
      async resolve({ id }, _args, ctx) {
        if (!id) {
          return [];
        }
        return await ctx.prisma.recipe
          .findUnique({
            where: {
              id,
            },
          })
          .ingredients();
      },
    });
  },
});

export const recipeQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("recipes", {
      type: Recipe.$name,
      resolve(_parent, _args, ctx) {
        return ctx.prisma.recipe.findMany();
      },
    });
  },
});

export const recipeMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createRecipe", {
      type: Recipe.$name,
      args: {
        name: "String",
        description: "String",
        ingredients: arg({ type: list("IngredientInput") }),
      },
      resolve(_parent, { name, description, ingredients }, ctx) {
        if (!name || !description || !ingredients) {
          throw new Error("Name, description and ingredients are required");
        }

        if (ingredients.length === 0) {
          throw new Error("At least one ingredient is required");
        }

        return ctx.prisma.recipe.create({
          data: {
            name,
            description,
            ingredients: {
              createMany: {
                data: ingredients,
              },
            },
          },
          include: {
            ingredients: true,
          },
        });
      },
    });
  },
});
